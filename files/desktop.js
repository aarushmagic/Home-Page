document.addEventListener('DOMContentLoaded', () => {
    // ... (Your JavaScript from above - keep all of it, with the following additions) ...
    document.getElementById("fullscreen-option").addEventListener("click", () => {
        if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen();
        }
    })
    document.addEventListener('fullscreenchange', (event) => {
        if (document.fullscreenElement) {
          document.getElementById("fullscreen-option").style.display = "none";
        } else {
          document.getElementById("fullscreen-option").style.display = "block";
        }
      });
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const windows = document.querySelectorAll('.window');
    const folderIcons = document.querySelectorAll('.folder-icon');
    const folderViews = document.querySelectorAll('.folder-view');
    const windowContainer = document.querySelector('.window-container');
    const closeButtons = document.querySelectorAll('.window-close');
    const resizeHandles = document.querySelectorAll('.window-resize-handle');
    const startButton = document.querySelector('.start-button');
    const taskbarIcons = document.querySelectorAll('.taskbar-icon');
    const searchInput = document.getElementById('search-input');
    const taskbarTime = document.getElementById('taskbar-time'); // Select time element within taskbar-time
    const timeDisplayTime = document.querySelector('.taskbar-time-time'); // Select time element within taskbar-time
    const timeDisplayDate = document.querySelector('.taskbar-time-date'); // Select date element within taskbar-time
    const notificationIcon = document.getElementById('notification-icon');
    const notificationPopup = document.getElementById('notification-popup');
    const notificationList = document.getElementById('notification-list');

    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const zoomResetButton = document.getElementById('zoom-reset');
    const calendarPopup = document.getElementById('calendar-popup');
    const calendarHeader = document.getElementById('calendar-header');
    const calendarDays = document.getElementById('calendar-days');
    const wifiIcon = document.getElementById('wifi-icon');
    const locationIcon = document.getElementById('location-icon');
    const batteryIcon = document.getElementById('battery-icon');
    const wifiTooltipText = document.getElementById('wifi-tooltip');
    const locationTooltipText = document.getElementById('location-tooltip');
    const batteryTooltipText = document.getElementById('battery-tooltip');


    // --- Start Menu Elements ---
    const startMenu = document.getElementById('start-menu');
    const restartOption = document.getElementById('restart-option');
    const shutdownOption = document.getElementById('shutdown-option');

    let pdfPage = null;
    let pdfViewport = null;
    let pdfCanvas = null;
    let pdfCanvasContext = null;
    let currentScale = 1.0;
    let calendarVisible = false;
    let notificationVisible = false;

    let currentZIndex = 1;

    // --- Terminal Functionality --- (rest of your terminal JavaScript - keep all of it) ...
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    // --- Dynamic File System based on HTML Content --- (rest of your file system JavaScript - keep all of it) ...
    function buildFileSystem() {
        return {
            '/': {
                type: 'dir',
                contents: {
                    'Resume': { type: 'file', elementId: 'resume-icon' },
                    'LinkedIn': { type: 'file', elementId: 'linkedin-icon' },
                    'GitHub': { type: 'file', elementId: 'github-icon' },
                    'Edge': { type: 'file', elementId: 'bing-icon' },
                    'Email': { type: 'file', elementId: 'email-icon' },
                    'Terminal': { type: 'file', elementId: 'terminal-icon' },
                    'Awards': {
                        type: 'dir',
                        elementId: 'awards-icon',
                        contents: {
                            'Mu Alpha Theta Scholarship': { type: 'file', elementId: 'mat' },
                            'Certificate of Excellence in Math': { type: 'file', elementId: 'dhsmath' },
                            'Science Bowl Regionals': { type: 'file', elementId: 'scibowl' },
                            'Dekalb County Tech Fair': { type: 'file', elementId: 'dcsdtech23' },
                            'GA State Tech Competition': { type: 'file', elementId: 'gatech23' },
                            'GA State Calculus Competition': { type: 'file', elementId: 'calccomp4' },
                            'GA State Calculus Competition (Team)': { type: 'file', elementId: 'calccomp1' },
                            'Tom Morley Award (Multivariable Calc)': { type: 'file', elementId: 'multimorley' },
                            'Tom Morley Award (Linear Algebra)': { type: 'file', elementId: 'linearmorley' }
                        }
                    }
                }
            }
        };
    }

    let fileSystem = buildFileSystem();
    let currentDirectory = fileSystem['/']; // Start at root
    let currentPath = '/';

    function printToTerminal(text, className = 'terminal-output') {
        const outputLine = document.createElement('div');
        outputLine.className = className;
        outputLine.textContent = text;
        terminalOutput.appendChild(outputLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll to bottom
    }

    function executeCommand(command) {
        // ... (rest of your executeCommand function - keep all of it) ...
        const parts = command.trim().split(/\s+/);
        const baseCommand = parts[0];
        const args = parts.slice(1);
        switch (baseCommand) {
            case 'help':
                printToTerminal('Available commands:\nhelp: Bring up the help menu\nclear: Clear the terminal screen\necho: Write arguments to the standard output\ndate: Get current date and time\nwhoami: Display information about Aarush\nls: List directory contents\ncd [dir]: Change working directory\npwd: Return working directory\nrm files: Remove files/directories\nrestart: Restart the page\nshutdown: Close all related pages\nfullscreen: Full screen the window\nopenurl [url]: Open a url in window (Note: not all urls may open)');
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'echo':
                printToTerminal(args.join(' '));
                break;
            case 'date':
                printToTerminal(new Date().toLocaleString());
                break;
            case 'whoami':
                printToTerminal("My name is Aarush Lanjharia and I am a Computer Science student at the Georgia Institute of technology with threads in intelligence and cybersecurity!\nAs my side hobbies, I love to 3D print, do magic tricks and make paper crafts!")
                break;
            case 'openurl':
                let urlToOpen = args[0]
                if (urlToOpen.substring(0, 7) != "http://" && urlToOpen.substring(0, 8) != "https://") {
                    urlToOpen = "https://" + urlToOpen;
                }
                printToTerminal(urlToOpen + " opened in new window")
                document.getElementById("generic-iframe").src = urlToOpen;
                document.getElementById("generic-window-title").innerHTML = `<i class="fa-solid fa-terminal" class = "genericTerminal" style></i>`
                const windowElement = document.getElementById("generic-window");
                windowElement.style.display = 'flex';
                windowElement.style.zIndex = currentZIndex++;
                break;
            case 'ls':
                let output = '';
                for (const itemName in currentDirectory.contents) {
                    output += itemName + (currentDirectory.contents[itemName].type === 'dir' ? '/' : '') + '\n';
                }
                printToTerminal(output || ' '); // Print space if directory empty to avoid no output
                break;
            case 'cd':
                if (!args[0]) {
                    currentDirectory = fileSystem['/'];
                    currentPath = '/';
                    break;
                }
                const targetDirName = args[0];
                if (args[0] == '..') {
                    if (currentPath !== '/') {
                        const pathParts = currentPath.split('/').filter(part => part);
                        pathParts.pop();
                        currentPath = '/' + pathParts.join('/');
                        if (currentPath === '/') currentDirectory = fileSystem['/'];
                        else {
                            let tempDir = fileSystem['/'];
                            for (const part of pathParts) {
                                if (tempDir.contents[part] && tempDir.contents[part].type === 'dir') {
                                    tempDir = tempDir.contents[part];
                                } else {
                                    printToTerminal(`cd: no such file or directory: ${args[0]}`);
                                    return;
                                }
                            }
                            currentDirectory = tempDir;
                        }

                    }
                } else if (currentDirectory.contents[targetDirName] && currentDirectory.contents[targetDirName].type === 'dir') {
                    currentDirectory = currentDirectory.contents[targetDirName];
                    currentPath += (currentPath === '/' ? '' : '/') + targetDirName;
                } else if (currentDirectory.contents[targetDirName] && currentDirectory.contents[targetDirName].type === 'file') {
                    printToTerminal(`cd functionality only supported for directories. ${args[0]} is a file`);
                } else {
                    printToTerminal(`cd: no such file or directory: ${args[0]}`);
                }
                document.getElementsByClassName("terminal-prompt")[0].innerHTML = "C:" + currentPath + ">"
                break;
            case 'pwd':
                printToTerminal(currentPath);
                break;
            case 'rm':
                if (!args[0]) {
                    printToTerminal('rm: missing operand');
                    return;
                }
                let target = "";
                for (let i = 0; i < args.length; i++) {
                    target += args[i] + " "
                }
                target = target.trim()
                if (target in currentDirectory.contents) {
                    const element = document.getElementById(currentDirectory.contents[target].elementId);
                    if (element) {
                        element.remove();
                    }
                    delete currentDirectory.contents[target];
                    printToTerminal(`Removed ${target}`);
                } else {
                    printToTerminal(`rm: cannot remove '${target}': No such file or directory`);
                }
                break;
            case 'restart':
                location.reload()
                break;
            case 'shutdown':
                for (const tab of openedTabs) {
                    if (!tab.closed) { // Check if already closed
                        tab.close();
                    }
                }
                openedTabs = []; // Clear the array

                window.location.replace('about:blank');
                break;
            case 'fullscreen':
                if (document.fullscreenEnabled) {
                    document.documentElement.requestFullscreen();
                }
                break;
            default:
                printToTerminal(`Command not recognized: ${baseCommand}`);
        }
    }

    terminalInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default newline in input
            const command = terminalInput.value;
            printToTerminal(`C:${currentPath}> ${command}`, 'terminal-output'); // Print user command
            executeCommand(command);
            terminalInput.value = ''; // Clear input
        }
    });

    // --- Window Dragging ... (rest of your JavaScript - keep all of it) ...
    let isDragging = false;
    let currentWindow = null;
    let offsetX, offsetY;

    function startDrag(e) {
        if (e.target.classList.contains('window-resize-handle')) return; // Don't drag from resize handle
        isDragging = true;
        currentWindow = e.target.closest('.window, .folder-view, .terminal-window, .bing-window'); // Include terminal window in draggable windows
        if (!currentWindow) return;

        windowContainer.style.pointerEvents = 'auto';
        currentWindow.style.zIndex = currentZIndex++;

        offsetX = e.clientX - currentWindow.offsetLeft;
        offsetY = e.clientY - currentWindow.offsetTop;

        document.addEventListener('mousemove', dragWindow);
        document.addEventListener('mouseup', stopDrag);
    }

    function dragWindow(e) {
        if (!isDragging || !currentWindow) return;
        currentWindow.style.left = e.clientX - offsetX + 'px';
        currentWindow.style.top = e.clientY - offsetY + 'px';
    }

    function stopDrag() {
        isDragging = false;
        currentWindow = null;
        windowContainer.style.pointerEvents = 'none';
        document.removeEventListener('mousemove', dragWindow);
        document.removeEventListener('mouseup', stopDrag);
    }

    document.querySelectorAll('.window-titlebar, .folder-view .window-titlebar, .terminal-window .window-titlebar, .bing-window .window-titlebar').forEach(titlebar => { // Include terminal window titlebar
        titlebar.addEventListener('mousedown', startDrag);
    });

    document.getElementById('bing-back').addEventListener('click', () => {
        document.getElementById('bing-iframe-box').contentWindow.history.back();
    })

    // --- Window Resizing ... (rest of your JavaScript - keep all of it) ...
    let isResizing = false;
    let currentResizeHandle = null;
    let initialWidth, initialHeight, initialX, initialY;

    function startResize(e) {
        isResizing = true;
        currentResizeHandle = e.target;
        currentWindow = e.target.closest('.window, .folder-view, .terminal-window, .bing-window'); // Include terminal window in resizable windows
        if (!currentWindow) return;

        windowContainer.style.pointerEvents = 'auto';
        currentWindow.style.zIndex = currentZIndex++;

        initialWidth = currentWindow.offsetWidth;
        initialHeight = currentWindow.offsetHeight;
        initialX = e.clientX;
        initialY = e.clientY;

        document.addEventListener('mousemove', resizeWindow);
        document.addEventListener('mouseup', stopResize);
    }

    function resizeWindow(e) {
        if (!isResizing || !currentWindow || !currentResizeHandle) return;

        let widthDiff = e.clientX - initialX;
        let heightDiff = e.clientY - initialY;

        if (currentResizeHandle.classList.contains('window-resize-e')) {
            currentWindow.style.width = initialWidth + widthDiff + 'px';
        } else if (currentResizeHandle.classList.contains('window-resize-w')) {
            currentWindow.style.width = initialWidth - widthDiff + 'px';
            currentWindow.style.left = parseFloat(currentWindow.style.left) + widthDiff + 'px'; // Keep right edge fixed
        } else if (currentResizeHandle.classList.contains('window-resize-n')) {
            currentWindow.style.height = initialHeight - heightDiff + 'px';
            currentWindow.style.top = parseFloat(currentWindow.style.top) + heightDiff + 'px'; // Keep bottom edge fixed
        } else if (currentResizeHandle.classList.contains('window-resize-s')) {
            currentWindow.style.height = initialHeight + heightDiff + 'px';
        } else if (currentResizeHandle.classList.contains('window-resize-nw')) {
            currentWindow.style.width = initialWidth - widthDiff + 'px';
            currentWindow.style.left = parseFloat(currentWindow.style.left) + widthDiff + 'px';
            currentWindow.style.height = initialHeight - heightDiff + 'px';
            currentWindow.style.top = parseFloat(currentWindow.style.top) + heightDiff + 'px';
        } else if (currentResizeHandle.classList.contains('window-resize-ne')) {
            currentWindow.style.width = initialWidth + widthDiff + 'px';
            currentWindow.style.height = initialHeight - heightDiff + 'px';
            currentWindow.style.top = parseFloat(currentWindow.style.top) + heightDiff + 'px';
        } else if (currentResizeHandle.classList.contains('window-resize-se')) {
            currentWindow.style.width = initialWidth + widthDiff + 'px';
            currentWindow.style.height = initialHeight + heightDiff + 'px';
        } else if (currentResizeHandle.classList.contains('window-resize-sw')) {
            currentWindow.style.width = initialWidth - widthDiff + 'px';
            currentWindow.style.left = parseFloat(currentWindow.style.left) + widthDiff + 'px';
            currentWindow.style.height = initialHeight + heightDiff + 'px';
        }
    }

    function stopResize() {
        isResizing = false;
        currentResizeHandle = null;
        currentWindow = null;
        windowContainer.style.pointerEvents = 'none';
        document.removeEventListener('mousemove', resizeWindow);
        document.removeEventListener('mouseup', stopResize);
    }

    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', startResize);
    });

    // --- Icon Click Handlers ... (UPDATED to include Bing window) ...
    document.getElementsByClassName("fa-solid fa-envelope")[0].addEventListener('click', () => {
        openNewTab('mailto:alanjharia@gmail.com');
    })
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.getAttribute('data-window');
            const folderId = icon.getAttribute('data-folder');

            windows.forEach(win => win.style.display = 'none');
            folderViews.forEach(folder => folder.style.display = 'none');
            document.querySelectorAll('.terminal-window').forEach(termWin => termWin.style.display = 'none');

            if (windowId) {
                const windowElement = document.getElementById(windowId);
                if (windowElement) {
                    if (windowId === 'linkedin-window') {
                        openNewTab('https://www.linkedin.com/in/aarush-lanjharia-065216228/', '_blank');
                        windowElement.style.display = 'none';
                    } else if (windowId === 'mail-window') {
                        openNewTab('mailto:alanjharia@gmail.com');
                        windowElement.style.display = 'none';
                    } else if (windowId === 'github-window') {
                        openNewTab('https://github.com/heightcalculator/', '_blank');
                        windowElement.style.display = 'none';
                    } else {
                        windowElement.style.display = 'flex';
                        windowElement.style.zIndex = currentZIndex++;
                    }
                }
            } else if (folderId) {
                const folderElement = document.getElementById(folderId);
                if (folderElement) {
                    folderElement.style.display = 'flex';
                    folderElement.style.zIndex = currentZIndex++;
                }
            }
        });
    });

    const awardsList = document.getElementById('awards-list').getElementsByTagName("li");
    for (let i = 0; i < awardsList.length; i++) {
        awardsList[i].addEventListener('mouseenter', () => {
            let eachid = awardsList[i].dataset.name;
            imgToOpen = document.getElementById("img-iframe")
            imgToOpen.src = "awards/" + eachid + ".png"
            windowElement = document.getElementById("img-window")
            windowElement.style.display = 'flex';
            windowElement.style.zIndex = currentZIndex++;
            windowElement.style.left = Number(window.getComputedStyle(document.getElementById("awards-folder")).left.slice(0, -2)) + Number(window.getComputedStyle(document.getElementById("awards-folder")).width.slice(0, -2)) + 10 + "px";
        })
    }
    document.getElementById("awards-folder").addEventListener('mouseleave', () => {
        document.getElementById("img-window").style.display = 'none';
    })


    document.getElementById("magicButton").addEventListener('click', () => {
        openNewTab("https://aarushmagic.com")
    })
    document.getElementById("rsaButton").addEventListener('click', () => {
        iframeToOpen = document.getElementById("generic-iframe")
        document.getElementById("generic-iframe").src = "https://rsa.aarushmagic.com/preview"
        document.getElementById("generic-window-title").innerHTML = "RSA Encryption"
        const windowElement = document.getElementById("generic-window");
        windowElement.style.display = 'flex';
        windowElement.style.zIndex = currentZIndex++;
    })
    document.getElementById("sundialButton").addEventListener('click', () => {
        document.getElementById("generic-iframe").src = "https://sundial.aarushmagic.com/make/two"
        document.getElementById("generic-window-title").innerHTML = "Sundial Maker";
        const windowElement = document.getElementById("generic-window");
        windowElement.style.display = 'flex';
        windowElement.style.zIndex = currentZIndex++;
    });
    document.getElementById("fontButton").addEventListener('click', () => {
        iframeToOpen = document.getElementById("generic-iframe")
        document.getElementById("generic-iframe").src = "https://fonts.aarushmagic.com"
        document.getElementById("generic-window-title").innerHTML = "Font Maker"
        const windowElement = document.getElementById("generic-window");
        windowElement.style.display = 'flex';
        windowElement.style.zIndex = currentZIndex++;
    })
    document.getElementById("imageButton").addEventListener('click', () => {
        iframeToOpen = document.getElementById("generic-iframe")
        document.getElementById("generic-iframe").src = "https://photos.aarushmagic.com"
        document.getElementById("generic-window-title").innerHTML = "Aarush's Photos"
        const windowElement = document.getElementById("generic-window");
        windowElement.style.display = 'flex';
        windowElement.style.zIndex = currentZIndex++;
    })

    // --- Close Button Handlers ... (rest of your JavaScript - keep all of it) ...
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const windowIdToClose = button.getAttribute('data-window');
            const folderIdToClose = button.getAttribute('data-folder');

            if (windowIdToClose) {
                const windowToClose = document.getElementById(windowIdToClose);
                if (windowToClose) {
                    windowToClose.style.display = 'none';
                }
            } else if (folderIdToClose) {
                const folderToClose = document.getElementById(folderIdToClose);
                if (folderToClose) {
                    folderToClose.style.display = 'none';
                }
            }
        });
    });

    // --- Start Button and Shutdown/Restart Functionality ---
    let startMenuVisible = false;

    startButton.addEventListener('click', (event) => {
        startMenuVisible = !startMenuVisible;
        startMenu.style.display = startMenuVisible ? 'flex' : 'none';
        event.stopPropagation(); // Prevent document click from immediately closing it
    });

    document.addEventListener('click', (event) => {
        if (startMenuVisible && !startButton.contains(event.target) && !startMenu.contains(event.target)) {
            startMenu.style.display = 'none';
            startMenuVisible = false;
        }
    });

    restartOption.addEventListener('click', () => {
        location.reload(); // Reloads the page (simulates restart)
    });

    // --- More Robust Shutdown (Closing all related tabs) ---
    let openedTabs = []; // Keep track of opened tabs

    // Example of opening a new tab and adding it to the list:
    function openNewTab(url) {
        const newTab = window.open(url, '_blank');
        openedTabs.push(newTab);
    }

    shutdownOption.addEventListener('click', () => {
        // Close all tabs in the openedTabs array
        for (const tab of openedTabs) {
            if (!tab.closed) { // Check if already closed
                tab.close();
            }
        }
        openedTabs = []; // Clear the array

        window.location.replace('about:blank'); // Close the main window
    });

    // --- Search Bar Functionality ... (UPDATED to include Bing in search results) ...
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (!searchTerm) return; // Don't search if empty

            windows.forEach(win => win.style.display = 'none'); // Hide all windows
            folderViews.forEach(folder => folder.style.display = 'none'); // Hide all folders
            document.querySelectorAll('.terminal-window').forEach(termWin => termWin.style.display = 'none'); // Hide terminal windows too

            let foundMatch = false;

            desktopIcons.forEach(icon => { // Search icon names too
                if (icon.textContent.toLowerCase().includes(searchTerm)) {
                    const windowId = icon.getAttribute('data-window');
                    const folderId = icon.getAttribute('data-folder');
                    if (windowId) {
                        document.getElementById(windowId).style.display = 'flex';
                        document.getElementById(windowId).style.zIndex = currentZIndex++;
                        if (windowId === 'resume-window') loadResumePDF();
                        foundMatch = true;
                    } else if (folderId) {
                        document.getElementById(folderId).style.display = 'flex';
                        document.getElementById(folderId).style.zIndex = currentZIndex++;
                        foundMatch = true;
                    }
                }
            });

            // Search Resume ... (rest of your JavaScript - keep all of it) ...
            const resumeContent = document.getElementById('resume-window').querySelector('.window-content').textContent.toLowerCase();
            if (resumeContent.includes(searchTerm)) {
                document.getElementById('resume-window').style.display = 'flex';
                document.getElementById('resume-window').style.zIndex = currentZIndex++;
                loadResumePDF();
                foundMatch = true;
            }

            // Search LinkedIn, GitHub, Awards, Certifications (rest of your search logic - keep all of it) ...
            const linkedinContent = document.getElementById('linkedin-window').querySelector('.window-content').textContent.toLowerCase();
            if (linkedinContent.includes(searchTerm) || "linkedin".includes(searchTerm)) {
                openNewTab("https://www.linkedin.com/in/aarush-lanjharia-065216228/")
                document.getElementById("linkedin-window").style.display = 'none';
                foundMatch = true;
            }

            const githubContent = document.getElementById('github-window').querySelector('.window-content').textContent.toLowerCase();
            if (githubContent.includes(searchTerm) || "github".includes(searchTerm)) {
                openNewTab("https://github.com/heightcalculator/")
                document.getElementById("github-window").style.display = 'none';
                foundMatch = true;
            }

            const awardsItems = document.querySelectorAll('#awards-folder .folder-content li');
            awardsItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(searchTerm)) {
                    document.getElementById('awards-folder').style.display = 'flex';
                    document.getElementById('awards-folder').style.zIndex = currentZIndex++;
                    foundMatch = true;
                }
            });

            const certificationsItems = document.querySelectorAll('#certifications-folder .folder-content li');
            certificationsItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(searchTerm)) {
                    document.getElementById('certifications-folder').style.display = 'flex';
                    document.getElementById('certifications-folder').style.zIndex = currentZIndex++;
                    foundMatch = true;
                }
            });

            // Search Bing (basic check - you can refine this)
            if (["bing", "search", "browser", "edge"].includes(searchTerm)) {
                document.getElementById('bing-window').style.display = 'flex';
                document.getElementById('bing-window').style.zIndex = currentZIndex++;
                foundMatch = true;
            }

            if (["magic", "tricks", "cards"].includes(searchTerm)) {
                openNewTab("https://aarushmagic.com")
                foundMatch = true;
            }

            if (["sundial"].includes(searchTerm)) {
                iframeToOpen = document.getElementById("generic-iframe")
                document.getElementById("generic-iframe").src = "https://sundial.aarushmagic.com/make/two"
                document.getElementById("generic-window-title").innerHTML = "Sundial Maker"
                const windowElement = document.getElementById("generic-window");
                windowElement.style.display = 'flex';
                windowElement.style.zIndex = currentZIndex++;
                foundMatch = true;
            }

            if (["rsa", "encryption", "encrypter", "key"].includes(searchTerm)) {
                iframeToOpen = document.getElementById("generic-iframe")
                document.getElementById("generic-iframe").src = "https://rsa.aarushmagic.com/preview"
                document.getElementById("generic-window-title").innerHTML = "RSA Encryption"
                const windowElement = document.getElementById("generic-window");
                windowElement.style.display = 'flex';
                windowElement.style.zIndex = currentZIndex++;
                foundMatch = true;
            }

            if (["font", "handwriting"].includes(searchTerm)) {
                iframeToOpen = document.getElementById("generic-iframe")
                document.getElementById("generic-iframe").src = "https://fonts.aarushmagic.com"
                document.getElementById("generic-window-title").innerHTML = "Font Maker"
                const windowElement = document.getElementById("generic-window");
                windowElement.style.display = 'flex';
                windowElement.style.zIndex = currentZIndex++;
                foundMatch = true;
            }

            if (["photos", "photo", "picture", "pictures", "memories"].includes(searchTerm)) {
                iframeToOpen = document.getElementById("generic-iframe")
                document.getElementById("generic-iframe").src = "https://photos.aarushmagic.com"
                document.getElementById("generic-window-title").innerHTML = "Aarush's Photos"
                const windowElement = document.getElementById("generic-window");
                windowElement.style.display = 'flex';
                windowElement.style.zIndex = currentZIndex++;
                foundMatch = true;
            }

            if (!foundMatch) {
                searchInput.style.color = "#cc0000"
                setTimeout(() => {
                    searchInput.style.color = "#555";
                }, "500");
            } else {
                searchInput.value = ""
            }
        }
    });

    // --- Bing Window iframe Height Fix ---
    function adjustIframeHeight() {
        const bingWindow = document.getElementById('bing-window');
        const windowContent = bingWindow.querySelector('.window-content');
        const iframe = windowContent.querySelector('iframe');

        // Calculate available height for the iframe:
        const windowHeight = bingWindow.offsetHeight;
        const titlebarHeight = bingWindow.querySelector('.window-titlebar').offsetHeight;
        const availableHeight = windowHeight - titlebarHeight;

        iframe.style.height = availableHeight + 'px';
    }

    // Call adjustIframeHeight initially and on window resize
    adjustIframeHeight();
    window.addEventListener('resize', adjustIframeHeight);

    // Call adjustIframeHeight when the Bing window is opened or resized
    const bingWindow = document.getElementById('bing-window');
    const bingResizeObserver = new ResizeObserver(adjustIframeHeight);
    bingResizeObserver.observe(bingWindow);
    // --- Date and Time Display and Calendar Popup (UPDATED - Rebuilt Calendar Generation) ---
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        timeDisplayTime.textContent = timeString;
        timeDisplayDate.textContent = dateString;
    }

    updateTime();
    setInterval(updateTime, 1000);

    function generateCalendar() {
        calendarDays.innerHTML = ''; // Clear previous days - VERY IMPORTANT!
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        calendarHeader.textContent = new Date(currentYear, currentMonth).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Add empty days for the start of the month to align with the correct weekday
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('span');
            emptyDay.className = 'calendar-day-empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('span');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            calendarDays.appendChild(dayElement);
        }
    }

    generateCalendar();

    taskbarTime.addEventListener('click', () => {
        calendarVisible = !calendarVisible;
        calendarPopup.style.display = calendarVisible ? 'flex' : 'none';
        if (calendarVisible) {
            generateCalendar(); // Regenerate calendar when showing
        }
    });

    document.addEventListener('click', (event) => {
        if (calendarVisible && !taskbarTime.contains(event.target) && !calendarPopup.contains(event.target)) {
            calendarPopup.style.display = 'none';
            calendarVisible = false;
        }
    });

    if (navigator.connection) {
        const connection = navigator.connection;
        wifiIcon.addEventListener('mouseover', async () => {  // Make listener async
            try {
                const response = await fetch('https://api.ipify.org?format=json'); // Fetch IP
                const data = await response.json();
                const ipAddress = data.ip;
                wifiTooltipText.textContent = `WiFi: ${ipAddress}`;
            } catch (error) {
                wifiTooltipText.textContent = 'WiFi: Not Available';
            }
        });
    } else {
        if (!navigator.onLine) {
            wifiTooltipText.textContent = 'WiFi: Offline';
        } else {
            wifiTooltipText.textContent = 'WiFi Info: Not Available';
        }
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Basic reverse geocoding (replace with a proper service for real apps)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                .then(response => response.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
                    const region = data.address.state || data.address.country || 'Unknown Region';
                    locationTooltipText.textContent = `Location: ${city}, ${region}`;
                })
                .catch(error => {
                    locationTooltipText.textContent = 'Location: Error getting location';
                });

        }, error => {
            locationTooltipText.textContent = 'Location: Location access denied';
        });
    } else {
        locationTooltipText.textContent = 'Location: Geolocation not supported';
    }

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateBatteryInfo() {
                const batteryLevel = Math.round(battery.level * 100);
                batteryTooltipText.textContent = `Battery: ${batteryLevel}% - ${battery.charging ? 'Charging' : ''}`;
                const batteryIconElement = batteryIcon.querySelector('i'); // Get the <i> element
                if (batteryIconElement) { // Check if the <i> element exists to avoid errors
                    if (batteryLevel > 87) {
                        batteryIconElement.className = 'fas fa-battery-full'
                    } else if (batteryLevel > 62) {
                        batteryIconElement.className = "fa-solid fa-battery-three-quarters"
                    } else if (batteryLevel > 37) {
                        batteryIconElement.className = "fa-solid fa-battery-half"
                    } else if (batteryLevel > 12) {
                        batteryIconElement.className = "fa-solid fa-battery-quarter"
                    } else {
                        batteryIconElement.className = "fa-solid fa-battery-empty"
                    }
                }
            }
            updateBatteryInfo();
            battery.addEventListener('chargingchange', updateBatteryInfo);
            battery.addEventListener('levelchange', updateBatteryInfo);
        }).catch(error => {
            batteryTooltipText.textContent = 'Battery Info: Not Available';
        });
    } else {
        batteryTooltipText.textContent = 'Battery Info: Not Available';
    }

    // --- Notification Functionality ---
    let commitsArr = []
    const owner = "heightcalculator"; // e.g., "octocat"
    const repo = "home-page";  // e.g., "Hello-World"
    const token = ""; // Optional, for private repos or higher rate limit

    async function getRecentCommitDescriptions() {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const commits = await response.json();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            // Filter commits from the last year
            const recentCommits = commits
                .filter(commit => new Date(commit.commit.author.date) >= oneYearAgo)
                .slice(0, 5); // Take only the first 5 commits

            recentCommits.reverse();
            return recentCommits;
        } catch (error) {
            return [];
        }
    }
    getRecentCommitDescriptions().then(descriptions => {
        commitsArr = descriptions;
        displayNotifications(descriptions);
    });

    function displayNotifications(commits) {
        notificationList.innerHTML = ''; // Clear existing notifications

        if (commits.length === 0) {
            const noUpdatesMessage = document.createElement('div');
            noUpdatesMessage.className = 'notification-item';
            noUpdatesMessage.textContent = 'No recent updates in the last year.';
            notificationList.appendChild(noUpdatesMessage);
            return;
        }

        commits.forEach(commit => {
            const message = commit.commit.message;
            const date = new Date(commit.commit.author.date).toLocaleDateString();

            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <b>${date}</b>: ${message}
            `;
            notificationList.appendChild(notificationItem);
        });
    }

    notificationIcon.addEventListener('click', (event) => {
        notificationVisible = !notificationVisible;
        notificationPopup.style.display = notificationVisible ? 'flex' : 'none';
        if (notificationVisible) {
            displayNotifications(commitsArr)
        }
        event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
        if (notificationVisible && !notificationIcon.contains(event.target) && !notificationPopup.contains(event.target)) {
            notificationPopup.style.display = 'none';
            notificationVisible = false;
        }
    });
});