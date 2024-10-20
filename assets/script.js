// Initialize Showdown converter
const converter = new showdown.Converter();

// Define an array with the desired order of file names
orderedFiles = [
    "introduction.md",        // Introduction to NoteWise
    "essential-tools.md",     // Essential Note-Taking and Productivity Tools
    "educational-tools.md",   // Universal Educational Tools
    "communication-tools.md", // Communication and Language Tools
    "creative-tools.md",      // Creative and Visualization Tools
    "specialized-tools.md",   // Specialized Academic and Professional Tools
    "personal-development.md",// Personal Development and Well-being Tools
    "developer-tools.md",     // Developer Tools and Application Platform
    "additional-features.md", // Additional Features Specific to E-Ink Device
    "conclusion.md"           // Conclusion
];

let currentIndex = 0; // Track the currently loaded file index

// Function to load and display the content of a Markdown file
function loadFile(fileName) {
    fetch(`/readme-files/${fileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`File not found: ${fileName}`);
            }
            return response.text();
        })
        .then(content => {
            // Convert Markdown to HTML using Showdown.js
            const htmlContent = converter.makeHtml(content);
            document.getElementById('fileContent').innerHTML = htmlContent;
            updateButtons(); // Update button states based on current index
        })
        .catch(error => {
            console.error('Error loading file content:', error);
            document.getElementById('fileContent').textContent = `Error: ${error.message}`;
        });
}

// Function to update the "Next" and "Previous" buttons
function updateButtons() {
    document.getElementById('prevBtn').disabled = currentIndex === 0; // Disable "Previous" if at the start
    document.getElementById('nextBtn').disabled = currentIndex === orderedFiles.length - 1; // Disable "Next" if at the end
}

// Event listeners for the "Next" and "Previous" buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        loadFile(orderedFiles[currentIndex]);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < orderedFiles.length - 1) {
        currentIndex++;
        loadFile(orderedFiles[currentIndex]);
    }
});

// Fetch the list of Markdown files from the server
fetch('/list-files')
    .then(response => response.json())
    .then(files => {
        const fileList = document.getElementById('fileList');

        // Use the ordered array to display files in a specific order
        const sortedFiles = orderedFiles.filter(file => files.includes(file));

        if (sortedFiles.length > 0) {
            // Populate the file list in the specified order
            sortedFiles.forEach((file, index) => {
                const li = document.createElement('li');
                li.textContent = file;
                li.onclick = () => {
                    currentIndex = index; // Set currentIndex when a file is clicked
                    loadFile(file);
                };
                fileList.appendChild(li);

                // Load the first file by default
                if (index === 0) {
                    loadFile(file);
                }
            });
        } else {
            document.getElementById('fileContent').textContent = 'No documentation files found.';
        }
    })
    .catch(error => {
        console.error('Error fetching file list:', error);
        document.getElementById('fileContent').textContent = `Error: ${error.message}`;
    });


    function setSidebarWidth() {
        const fileListItems = document.querySelectorAll('#fileList li');
        let longestWidth = 0;
    
        fileListItems.forEach(item => {
            const itemWidth = item.offsetWidth;
            if (itemWidth > longestWidth) {
                longestWidth = itemWidth;
            }
        });
    
        // Add some padding or margin for safety
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.minWidth = `${longestWidth + 20}px`; // Add padding to account for inner spacing
    }
    
    // Call this function after populating the sidebar
    fetch('/list-files')
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
    
            // Use the ordered array to display files in a specific order
            const sortedFiles = orderedFiles.filter(file => files.includes(file));
    
            if (sortedFiles.length > 0) {
                sortedFiles.forEach((file, index) => {
                    const li = document.createElement('li');
                    li.textContent = file;
                    li.onclick = () => {
                        currentIndex = index;
                        loadFile(file);
                    };
                    fileList.appendChild(li);
    
                    if (index === 0) {
                        loadFile(file);
                    }
                });
    
                // Adjust sidebar width after file list is populated
                setSidebarWidth();
            } else {
                document.getElementById('fileContent').textContent = 'No documentation files found.';
            }
        })
        .catch(error => {
            console.error('Error fetching file list:', error);
            document.getElementById('fileContent').textContent = `Error: ${error.message}`;
        });
    