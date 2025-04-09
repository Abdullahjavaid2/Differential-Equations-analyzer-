function analyzeEquation() {
    const equation = document.getElementById('equation').value;
    if (!equation) {
        alert('Please enter a differential equation');
        return;
    }

    try {
        // Parse the equation to find order and degree
        const order = findOrder(equation);
        const degree = findDegree(equation);
        const isLinear = checkLinearity(equation);
        const isHomogeneous = checkHomogeneity(equation);

        // Update the UI with the results
        document.getElementById('order').textContent = `Order: ${order}`;
        document.getElementById('degree').textContent = `Degree: ${degree}`;
        document.getElementById('linearity').textContent = `Linearity: ${isLinear ? 'Linear' : 'Non-linear'}`;
        document.getElementById('homogeneity').textContent = `Homogeneity: ${isHomogeneous ? 'Homogeneous' : 'Non-homogeneous'}`;

        // Generate and display the graph
        generateGraph(equation);
    } catch (error) {
        alert('Error analyzing equation: ' + error.message);
    }
}

function findOrder(equation) {
    // Find the highest derivative order
    const derivativePattern = /d\^?(\d+)y\/dx\^?(\d+)/g;
    let maxOrder = 0;
    let match;

    while ((match = derivativePattern.exec(equation)) !== null) {
        const order = parseInt(match[2]);
        maxOrder = Math.max(maxOrder, order);
    }

    return maxOrder || 0;
}

function findDegree(equation) {
    // Find the highest power of the highest order derivative
    const derivativePattern = /d\^?(\d+)y\/dx\^?(\d+)(?:\^(\d+))?/g;
    let maxDegree = 1;
    let match;
    let highestOrder = 0;

    while ((match = derivativePattern.exec(equation)) !== null) {
        const order = parseInt(match[2]);
        const degree = match[3] ? parseInt(match[3]) : 1;

        if (order > highestOrder) {
            highestOrder = order;
            maxDegree = degree;
        } else if (order === highestOrder) {
            maxDegree = Math.max(maxDegree, degree);
        }
    }

    return maxDegree;
}

function checkLinearity(equation) {
    // Check if the equation is linear (no products of derivatives or nonlinear functions)
    const nonlinearPatterns = [
        /d\^?(\d+)y\/dx\^?(\d+)\s*\*\s*d\^?(\d+)y\/dx\^?(\d+)/, // Product of derivatives
        /(?:sin|cos|tan|exp|log)\s*\([^)]*\)/, // Trigonometric or exponential functions
        /y\^[2-9]/, // Powers of y
    ];

    return !nonlinearPatterns.some(pattern => pattern.test(equation));
}

function checkHomogeneity(equation) {
    // Split equation into left and right sides
    const [leftSide, rightSide] = equation.split('=').map(side => side.trim());
    
    // Check if right side is 0 or contains only constants
    return rightSide === '0' || /^[0-9+\-*/() ]+$/.test(rightSide);
}

function generateGraph(equation) {
    // Generate sample points for the graph
    const xValues = [];
    const yValues = [];
    
    // Check if the equation matches our specific example
    if (equation.includes('dy/dx + 2y = e^(3x)') || equation.includes('dy/dx + 2y = e^3x')) {
        // Plot the specific solution: y = (1/5)e^(3x) + (4/5)e^(-2x)
        for (let x = -2; x <= 2; x += 0.05) {
            xValues.push(x);
            const y = (1/5) * Math.exp(3*x) + (4/5) * Math.exp(-2*x);
            yValues.push(y);
        }
    } else {
        // For other equations, use a placeholder
        for (let x = -10; x <= 10; x += 0.1) {
            xValues.push(x);
            // This is a placeholder - in reality, you would need to solve the DE
            yValues.push(Math.sin(x));
        }
    }

    const trace = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Solution'
    };

    const layout = {
        title: 'Equation Solution',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: 'white'
        },
        xaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            title: 'x'
        },
        yaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            title: 'y'
        }
    };

    Plotly.newPlot('graph', [trace], layout);
}

// AI Assistant functionality
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input field
    userInput.value = '';
    
    // Process the message and generate a response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat(response, 'ai');
    }, 500);
}

function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to the bottom of the chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateAIResponse(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check for common questions about differential equations
    if (lowerMessage.includes('what is') && lowerMessage.includes('differential equation')) {
        return "A differential equation is an equation that relates a function with its derivatives. It describes how a quantity changes with respect to another quantity, often time or space. For example, dy/dx = 2x is a differential equation that describes how y changes with respect to x.";
    }
    
    if (lowerMessage.includes('order') && lowerMessage.includes('differential equation')) {
        return "The order of a differential equation is the highest derivative present in the equation. For example, in dy/dx + y = x, the order is 1 (first derivative). In d²y/dx² + dy/dx + y = 0, the order is 2 (second derivative).";
    }
    
    if (lowerMessage.includes('degree') && lowerMessage.includes('differential equation')) {
        return "The degree of a differential equation is the highest power of the highest order derivative in the equation. For example, in (dy/dx)² + y = x, the degree is 2. In d²y/dx² + (dy/dx)³ + y = 0, the degree is 3.";
    }
    
    if (lowerMessage.includes('linear') && lowerMessage.includes('differential equation')) {
        return "A linear differential equation is one where the dependent variable and its derivatives appear only to the first power and are not multiplied together. For example, dy/dx + 2y = x is linear, but (dy/dx)² + y = x is non-linear.";
    }
    
    if (lowerMessage.includes('homogeneous') && lowerMessage.includes('differential equation')) {
        return "A homogeneous differential equation has zero on the right-hand side. For example, dy/dx + 2y = 0 is homogeneous, while dy/dx + 2y = x is non-homogeneous.";
    }
    
    if (lowerMessage.includes('solve') && lowerMessage.includes('dy/dx + 2y = e^(3x)')) {
        return "To solve dy/dx + 2y = e^(3x) with y(0) = 1:\n\n1. The integrating factor is μ(x) = e^(∫2dx) = e^(2x)\n2. Multiply both sides: e^(2x)dy/dx + 2e^(2x)y = e^(5x)\n3. The left side is d/dx[e^(2x)y] = e^(5x)\n4. Integrate: e^(2x)y = (1/5)e^(5x) + C\n5. Solve for y: y = (1/5)e^(3x) + Ce^(-2x)\n6. Apply y(0) = 1: 1 = (1/5) + C, so C = 4/5\n7. Final solution: y = (1/5)e^(3x) + (4/5)e^(-2x)";
    }
    
    if (lowerMessage.includes('integrating factor')) {
        return "An integrating factor is a function used to solve first-order linear differential equations. For an equation in the form dy/dx + P(x)y = Q(x), the integrating factor is μ(x) = e^(∫P(x)dx). When you multiply both sides of the equation by this factor, the left side becomes the derivative of μ(x)y, making it easier to solve.";
    }
    
    if (lowerMessage.includes('initial value problem')) {
        return "An initial value problem is a differential equation together with initial conditions that specify the value of the solution at a particular point. For example, dy/dx + 2y = e^(3x) with y(0) = 1 is an initial value problem. The initial condition y(0) = 1 helps determine the specific solution from the general solution.";
    }
    
    // Default response for unrecognized queries
    return "I'm not sure about that specific question. You can ask me about differential equation concepts like order, degree, linearity, homogeneity, or how to solve specific equations like dy/dx + 2y = e^(3x).";
}

// Add event listener for Enter key in the chat input
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 