// Function to load and display the USA SVG map
async function loadUSAMap() {
    const mapContainer = document.getElementById('map-container');
    
    try {
        // For local file access, we'll need to embed the SVG directly or use a local server
        // Try to load the SVG file
        const response = await fetch('../src/assets/us.svg');
        
        if (!response.ok) {
            throw new Error('Failed to load SVG file');
        }
        
        const svgText = await response.text();
        
        // Parse the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        
        // Check for parsing errors
        if (svgElement.nodeName === 'parsererror') {
            throw new Error('Invalid SVG file');
        }
        
        // Set proper attributes for the SVG
        svgElement.setAttribute('id', 'usa-map');
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.style.maxWidth = '900px';
        
        // Find all state paths (they have 2-letter state code IDs)
        const paths = svgElement.querySelectorAll('path');
        
        paths.forEach(path => {
            const stateId = path.getAttribute('id');
            
            // Check if this is a state path (2-letter code)
            if (stateId && stateId.length === 2 && statesData[stateId]) {
                // Add class and data attribute
                path.setAttribute('class', 'state');
                path.setAttribute('data-state-code', stateId);
                
                // Remove any inline fill styles to use CSS styling
                path.style.removeProperty('fill');
                path.removeAttribute('style');
                
                // Add click event listener
                path.addEventListener('click', () => handleStateClick(stateId));
                
                // Remove any existing title/text that might give away the answer
                const title = path.querySelector('title');
                if (title) {
                    title.remove();
                }
            }
        });
        
        // Remove any text elements that might show state names
        const textElements = svgElement.querySelectorAll('text');
        textElements.forEach(text => text.remove());
        
        // Clear container and add the SVG
        mapContainer.innerHTML = '';
        mapContainer.appendChild(svgElement);
        
    } catch (error) {
        console.error('Error loading SVG map:', error);
        
        // If fetch fails (likely due to CORS), provide instructions
        mapContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #666;">Unable to load the map file directly.</p>
                <p style="color: #666; margin-top: 10px;">To play the game:</p>
                <ol style="text-align: left; display: inline-block; color: #666;">
                    <li>Open a terminal in the game folder</li>
                    <li>Run: <code style="background: #f0f0f0; padding: 2px 5px;">python -m http.server 8000</code></li>
                    <li>Open your browser to: <code style="background: #f0f0f0; padding: 2px 5px;">http://localhost:8000</code></li>
                </ol>
                <p style="color: #999; margin-top: 20px; font-size: 0.9em;">
                    (Or use any other local web server like Live Server in VS Code)
                </p>
            </div>
        `;
    }
}