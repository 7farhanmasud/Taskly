document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Guard Verification
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Set greeting name details
    document.getElementById('welcomeUserMessage').textContent = `Welcome, ${userName || 'User'}`;

    // 2. Application UI States
    let globalProjectsList = [];
    let currentActiveProject = null;

    // 3. Document Element References
    const logoutButton = document.getElementById('logoutButton');
    const projectForm = document.getElementById('projectForm');
    const projectListDisplay = document.getElementById('projectListDisplay');
    
    const activeWorkspacePanel = document.getElementById('activeWorkspacePanel');
    const emptyWorkspaceMessage = document.getElementById('emptyWorkspaceMessage');
    const projectDetailSection = document.getElementById('projectDetailSection');
    
    const currentProjectTitle = document.getElementById('currentProjectTitle');
    const currentProjectDesc = document.getElementById('currentProjectDesc');
    const taskForm = document.getElementById('taskForm');
    const taskListDisplay = document.getElementById('taskListDisplay');

    // ==========================================
    // CORE FUNCTIONAL METHODS
    // ==========================================

    // Fetch and sync list of system projects
    async function loadAllProjects() {
        try {
            globalProjectsList = await api.get('/projects');
            renderProjectSidebarList();
        } catch (error) {
            alert('Failed to retrieve project information: ' + error.message);
        }
    }

    // Render list elements inside the sidebar window view
    function renderProjectSidebarList() {
        projectListDisplay.innerHTML = '';
        
        if (globalProjectsList.length === 0) {
            projectListDisplay.innerHTML = '<li style="color: var(--text-muted); font-size: 0.875rem;">No projects matching criteria.</li>';
            return;
        }

        globalProjectsList.forEach(proj => {
            const li = document.createElement('li');
            li.className = `project-item-card ${currentActiveProject && currentActiveProject._id === proj._id ? 'active' : ''}`;
            
            li.innerHTML = `
                <div class="project-meta-header">
                    <h4>${escapeHTML(proj.title)}</h4>
                    <button class="btn btn-danger btn-delete-project" data-id="${proj._id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Delete</button>
                </div>
                <p>${escapeHTML(proj.description)}</p>
                <button class="btn btn-primary btn-open-project" data-id="${proj._id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; margin-top: 0.5rem;">Open</button>
            `;

            // Setup programmatic target click events
            li.querySelector('.btn-open-project').addEventListener('click', (e) => {
                e.stopPropagation();
                selectActiveWorkspace(proj);
            });

            li.querySelector('.btn-delete-project').addEventListener('click', (e) => {
                e.stopPropagation();
                removeTargetedProject(proj._id);
            });

            projectListDisplay.appendChild(li);
        });
    }

    // Establish active dashboard targets
    async function selectActiveWorkspace(project) {
        currentActiveProject = project;
        renderProjectSidebarList(); // Sync conditional layout borders

        // Display dashboard main project framework controls
        emptyWorkspaceMessage.style.display = 'none';
        projectDetailSection.style.display = 'block';

        currentProjectTitle.textContent = project.title;
        currentProjectDesc.textContent = project.description;

        await refreshProjectTasksStream();
    }

    // Fetch and populate list elements inside the active project workspace
    async function refreshProjectTasksStream() {
        if (!currentActiveProject) return;
        
        try {
            const tasks = await api.get(`/tasks?project=${currentActiveProject._id}`);
            taskListDisplay.innerHTML = '';

            if (tasks.length === 0) {
                taskListDisplay.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">No tasks defined inside this project structure.</p>';
                return;
            }

            for (const task of tasks) {
                const taskCard = document.createElement('div');
                taskCard.className = 'task-item-card';

                taskCard.innerHTML = `
                    <div class="task-header-row">
                        <div class="task-title-txt">${escapeHTML(task.title)}</div>
                        <button class="btn btn-danger btn-delete-task" data-id="${task._id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Delete Task</button>
                    </div>
                    <div class="task-desc-txt">${escapeHTML(task.description)}</div>
                    <div class="task-assignment-tag">Assigned to: <strong>${escapeHTML(task.assignedTo?.name || 'Unassigned')}</strong> (${escapeHTML(task.assignedTo?.email || '')})</div>
                    
                    <div class="task-actions-row">
                        <div>
                            <label style="font-size: 0.875rem; font-weight: 500;">Status: </label>
                            <select class="status-dropdown-menu" data-id="${task._id}">
                                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                    </div>

                    <div class="comments-panel-wrapper">
                        <div class="comment-box-title">Comments Section</div>
                        <div class="comments-stream-list" id="comments-container-${task._id}">Loading comments...</div>
                        <form class="comment-form-inline" data-taskid="${task._id}">
                            <input type="text" placeholder="Write a comment..." required>
                            <button type="submit" class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Add</button>
                        </form>
                    </div>
                `;

                // Handle task state modifications
                taskCard.querySelector('.status-dropdown-menu').addEventListener('change', async (e) => {
                    await alterTaskStatus(task._id, e.target.value);
                });

                // Handle structural removal operations
                taskCard.querySelector('.btn-delete-task').addEventListener('click', () => {
                    removeTargetedTask(task._id);
                });

                // Handle standard text commentary logs
                taskCard.querySelector('.comment-form-inline').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const inputField = e.target.querySelector('input');
                    await pushNewComment(task._id, inputField.value.trim());
                    inputField.value = '';
                });

                taskListDisplay.appendChild(taskCard);

                // Asynchronously trigger inner comment payload fetches
                fetchAndRenderComments(task._id);
            }
        } catch (error) {
            alert('Error refreshing tasks panel: ' + error.message);
        }
    }

    // Modify specific objectives items
    async function alterTaskStatus(taskId, targetStatus) {
        try {
            await api.put(`/tasks/${taskId}`, { status: targetStatus });
        } catch (error) {
            alert('Failed updating state boundaries: ' + error.message);
            await refreshProjectTasksStream(); // Revert local options parameters
        }
    }

    // Fetch and display project comments
    async function fetchAndRenderComments(taskId) {
        const targetContainer = document.getElementById(`comments-container-${taskId}`);
        if (!targetContainer) return;

        try {
            const commentsList = await api.get(`/comments/${taskId}`);
            targetContainer.innerHTML = '';

            if (commentsList.length === 0) {
                targetContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">No comments posted yet.</div>';
                return;
            }

            commentsList.forEach(comment => {
                const commentBubble = document.createElement('div');
                commentBubble.className = 'comment-bubble-item';
                commentBubble.innerHTML = `
                    <div class="comment-author-meta">${escapeHTML(comment.user?.name || 'Unknown')}</div>
                    <div class="comment-text-body">${escapeHTML(comment.text)}</div>
                `;
                targetContainer.appendChild(commentBubble);
            });
            
            // Auto scroll container view straight down to bottom elements
            targetContainer.scrollTop = targetContainer.scrollHeight;
        } catch (error) {
            targetContainer.innerHTML = '<div style="color: var(--danger-color); font-size: 0.75rem;">Failed to fetch comments.</div>';
        }
    }

    // Post comment logs to targeted tasks
    async function pushNewComment(taskId, commentaryString) {
        if (!commentaryString) return;
        try {
            await api.post('/comments', { taskId, text: commentaryString });
            await fetchAndRenderComments(taskId);
        } catch (error) {
            alert('Failed appending comment line: ' + error.message);
        }
    }

    // Remove absolute project entities out of systems databases
    async function removeTargetedProject(projectId) {
        if (!confirm('Are you completely sure you want to delete this project? This removes ALL associated tasks and comments permanently.')) return;
        try {
            await api.delete(`/projects/${projectId}`);
            
            // Reset central viewport states if user removes active details
            if (currentActiveProject && currentActiveProject._id === projectId) {
                currentActiveProject = null;
                projectDetailSection.style.display = 'none';
                emptyWorkspaceMessage.style.display = 'block';
            }
            
            await loadAllProjects();
        } catch (error) {
            alert('Failed processing system project deletion request: ' + error.message);
        }
    }

    // Remove task objects out of project sets
    async function removeTargetedTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            await refreshProjectTasksStream();
        } catch (error) {
            alert('Failed removing targeted task structure: ' + error.message);
        }
    }

    // ==========================================
    // ACTIONABLE FORM EVENT BINDINGS
    // ==========================================

    // Capture project submission configurations
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleField = document.getElementById('projectTitle');
        const descField = document.getElementById('projectDesc');

        try {
            await api.post('/projects', {
                title: titleField.value.trim(),
                description: descField.value.trim()
            });

            titleField.value = '';
            descField.value = '';
            
            await loadAllProjects();
        } catch (error) {
            alert('Failed creating target project node: ' + error.message);
        }
    });

    // Capture task submission variables
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentActiveProject) return;

        const titleField = document.getElementById('taskTitle');
        const descField = document.getElementById('taskDesc');
        const assigneeField = document.getElementById('taskAssignee');

        try {
            await api.post('/tasks', {
                title: titleField.value.trim(),
                description: descField.value.trim(),
                project: currentActiveProject._id,
                assignedToEmail: assigneeField.value.trim()
            });

            titleField.value = '';
            descField.value = '';
            assigneeField.value = '';

            await refreshProjectTasksStream();
        } catch (error) {
            alert('Failed creating task: ' + error.message);
        }
    });

    // End application navigation tracking systems cleanly
    logoutButton.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Utility text parsing method to block raw markdown inputs injection vulnerabilities
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Bootstrap internal layout elements instantly at initialization checkpoints
    loadAllProjects();
});