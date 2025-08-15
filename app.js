// FLEXRNet Application JavaScript
class FLEXRNetSimulation {
    constructor() {
        this.isRunning = false;
        this.currentScenario = 'normal';
        this.simulationTime = 0;
        this.events = [];
        this.nodes = [];
        this.xrUsers = [];
        this.networkLinks = [];
        
        // Architecture data
        this.architecture = {
            layers: [
                {
                    name: "Application Layer",
                    components: [
                        {name: "Multi-User XR Digital Twin", description: "3D shared environment with 50-200 virtual users generating pose, audio, and interaction data"},
                        {name: "ARENA-style Platform", description: "Web-based collaborative XR framework enabling real-time multi-user experiences"},
                        {name: "Real-time Visualization", description: "Live network topology and user interaction display with performance metrics"}
                    ]
                },
                {
                    name: "Edge AI Layer", 
                    components: [
                        {name: "Federated Learning Agents", description: "Privacy-preserving distributed learning across edge nodes without central coordination"},
                        {name: "Resource Allocation RL", description: "Reinforcement learning for dynamic bandwidth, processing, and caching optimization"},
                        {name: "Decision Engines", description: "Local optimization algorithms for path selection and redundancy control"}
                    ]
                },
                {
                    name: "Network Coding Layer",
                    components: [
                        {name: "Adaptive RLNC", description: "Dynamic redundancy factor adjustment based on channel conditions and priority class"},
                        {name: "Priority-Aware Scheduler", description: "Gold/Silver/Bronze traffic classification with latency-optimized scheduling"},
                        {name: "Galois Field GF(256)", description: "Mathematical foundation for linear coding operations and error correction"}
                    ]
                },
                {
                    name: "Physical Network Layer",
                    components: [
                        {name: "Multi-Protocol Mesh", description: "WiFi, mmWave, LoRa, BLE adaptive switching based on load, range, and QoS requirements"},
                        {name: "Beamforming Control", description: "mmWave directional communication with real-time beam steering and blockage mitigation"},
                        {name: "Mobile Edge Computing", description: "Distributed computational resources with dynamic load balancing and service migration"}
                    ]
                }
            ]
        };

        this.initializeNodes();
        this.initializeEventHandlers();
        this.initializeNetworkTopology();
        this.initializeTooltips();
        
        // Start with first layer selected
        this.selectLayer(0);
    }

    initializeNodes() {
        // Initialize edge nodes with realistic positions
        this.nodes = [
            {id: "edge_node_00", x: 150, y: 100, location: "Sector_A_1", cpu: 0.6, memory: 0.4, bandwidth: 0.7, connections: 85, rl_reward: 0.8, status: "active"},
            {id: "edge_node_01", x: 350, y: 120, location: "Sector_B_1", cpu: 0.3, memory: 0.6, bandwidth: 0.5, connections: 52, rl_reward: 0.9, status: "learning"},
            {id: "edge_node_02", x: 550, y: 150, location: "Sector_C_1", cpu: 0.8, memory: 0.7, bandwidth: 0.8, connections: 124, rl_reward: 0.6, status: "active"},
            {id: "edge_node_03", x: 650, y: 300, location: "Sector_D_1", cpu: 0.4, memory: 0.3, bandwidth: 0.6, connections: 67, rl_reward: 0.85, status: "updating"},
            {id: "edge_node_04", x: 180, y: 350, location: "Sector_A_2", cpu: 0.7, memory: 0.5, bandwidth: 0.7, connections: 98, rl_reward: 0.75, status: "active"},
            {id: "edge_node_05", x: 380, y: 380, location: "Sector_B_2", cpu: 0.5, memory: 0.8, bandwidth: 0.4, connections: 43, rl_reward: 0.7, status: "learning"},
            {id: "edge_node_06", x: 580, y: 420, location: "Sector_C_2", cpu: 0.9, memory: 0.2, bandwidth: 0.8, connections: 147, rl_reward: 0.65, status: "active"},
            {id: "edge_node_07", x: 450, y: 250, location: "Sector_D_2", cpu: 0.35, memory: 0.45, bandwidth: 0.55, connections: 71, rl_reward: 0.88, status: "active"}
        ];

        // Initialize XR users
        this.xrUsers = [
            {id: "user_001", x: 200, y: 180, device: "VR_headset", quality: "excellent", activity: "exploring"},
            {id: "user_002", x: 320, y: 220, device: "AR_glasses", quality: "good", activity: "collaborating"},
            {id: "user_003", x: 480, y: 200, device: "mobile", quality: "fair", activity: "presenting"},
            {id: "user_004", x: 250, y: 300, device: "VR_headset", quality: "excellent", activity: "gaming"},
            {id: "user_005", x: 400, y: 320, device: "AR_glasses", quality: "good", activity: "meeting"},
        ];

        // Generate network links
        this.generateNetworkLinks();
    }

    generateNetworkLinks() {
        this.networkLinks = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(this.nodes[i].x - this.nodes[j].x, 2) + 
                    Math.pow(this.nodes[i].y - this.nodes[j].y, 2)
                );
                
                // Connect nodes within reasonable distance
                if (distance < 300) {
                    this.networkLinks.push({
                        source: i,
                        target: j,
                        distance: distance,
                        active: Math.random() > 0.3
                    });
                }
            }
        }
    }

    initializeEventHandlers() {
        // Architecture layer selection
        document.querySelectorAll('.architecture-layer').forEach((layer, index) => {
            layer.addEventListener('click', () => this.selectLayer(index));
        });

        // Control panel
        document.getElementById('start-simulation').addEventListener('click', () => this.startSimulation());
        document.getElementById('stop-simulation').addEventListener('click', () => this.stopSimulation());
        document.getElementById('scenario-select').addEventListener('change', (e) => this.changeScenario(e.target.value));
        document.getElementById('redundancy-slider').addEventListener('input', (e) => this.updateRedundancy(e.target.value));
        document.getElementById('export-results').addEventListener('click', () => this.exportResults());
    }

    selectLayer(layerIndex) {
        // Remove active class from all layers
        document.querySelectorAll('.architecture-layer').forEach(layer => {
            layer.classList.remove('active');
        });

        // Add active class to selected layer
        document.querySelectorAll('.architecture-layer')[layerIndex].classList.add('active');

        // Update layer details
        const layer = this.architecture.layers[layerIndex];
        const detailsDiv = document.getElementById('layer-details');
        
        let detailsHTML = `
            <h3 style="color: var(--color-primary); margin-bottom: 16px;">${layer.name}</h3>
            <div class="component-details">
        `;

        layer.components.forEach(component => {
            detailsHTML += `
                <div class="component-detail" style="margin-bottom: 12px; padding: 12px; background: rgba(var(--color-teal-300-rgb), 0.05); border-radius: 6px; border: 1px solid rgba(var(--color-teal-300-rgb), 0.2);">
                    <h4 style="color: var(--color-primary); margin-bottom: 8px; font-size: 14px;">${component.name}</h4>
                    <p style="color: var(--color-text-secondary); font-size: 13px; margin: 0;">${component.description}</p>
                </div>
            `;
        });

        detailsHTML += `</div>`;
        detailsDiv.innerHTML = detailsHTML;
    }

    initializeNetworkTopology() {
        const svg = document.getElementById('network-graph');
        
        // Clear existing content
        svg.innerHTML = '';

        // Draw network links
        this.networkLinks.forEach(link => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', this.nodes[link.source].x);
            line.setAttribute('y1', this.nodes[link.source].y);
            line.setAttribute('x2', this.nodes[link.target].x);
            line.setAttribute('y2', this.nodes[link.target].y);
            line.classList.add('network-link');
            if (link.active) {
                line.classList.add('active');
            }
            svg.appendChild(line);
        });

        // Draw edge nodes
        this.nodes.forEach((node, index) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('network-node');
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', 15);
            
            // Color based on performance
            const avgPerf = (node.rl_reward + (1 - node.cpu) + (1 - node.memory)) / 3;
            let fillColor;
            if (avgPerf > 0.8) fillColor = '#00ff00';
            else if (avgPerf > 0.6) fillColor = 'var(--color-primary)';
            else if (avgPerf > 0.4) fillColor = 'var(--color-warning)';
            else fillColor = 'var(--color-error)';
            
            circle.setAttribute('fill', fillColor);
            circle.setAttribute('stroke', 'var(--color-text)');
            circle.setAttribute('stroke-width', '2');
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 25);
            text.classList.add('node-label');
            text.textContent = node.id.replace('edge_node_', 'N');
            
            g.appendChild(circle);
            g.appendChild(text);
            
            // Add hover tooltip
            g.addEventListener('mouseenter', (e) => this.showNodeTooltip(e, node));
            g.addEventListener('mouseleave', () => this.hideTooltip());
            
            svg.appendChild(g);
        });

        // Draw XR users
        this.xrUsers.forEach(user => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', user.x - 6);
            rect.setAttribute('y', user.y - 6);
            rect.setAttribute('width', 12);
            rect.setAttribute('height', 12);
            rect.setAttribute('rx', 2);
            
            // Color based on connection quality
            let fillColor;
            if (user.quality === 'excellent') fillColor = '#00ff00';
            else if (user.quality === 'good') fillColor = 'var(--color-primary)';
            else if (user.quality === 'fair') fillColor = 'var(--color-warning)';
            else fillColor = 'var(--color-error)';
            
            rect.setAttribute('fill', fillColor);
            rect.setAttribute('stroke', 'var(--color-text)');
            rect.setAttribute('stroke-width', '1');
            
            g.appendChild(rect);
            
            // Add hover tooltip
            g.addEventListener('mouseenter', (e) => this.showUserTooltip(e, user));
            g.addEventListener('mouseleave', () => this.hideTooltip());
            
            svg.appendChild(g);
        });
    }

    initializeTooltips() {
        this.tooltip = document.getElementById('tooltip');
    }

    showNodeTooltip(event, node) {
        const tooltip = this.tooltip;
        tooltip.innerHTML = `
            <strong>${node.id}</strong><br>
            Location: ${node.location}<br>
            CPU: ${(node.cpu * 100).toFixed(1)}%<br>
            Memory: ${(node.memory * 100).toFixed(1)}%<br>
            Bandwidth: ${(node.bandwidth * 100).toFixed(1)}%<br>
            Connections: ${node.connections}<br>
            RL Reward: ${(node.rl_reward * 100).toFixed(1)}%<br>
            Status: ${node.status}
        `;
        
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
        tooltip.classList.remove('hidden');
    }

    showUserTooltip(event, user) {
        const tooltip = this.tooltip;
        tooltip.innerHTML = `
            <strong>${user.id}</strong><br>
            Device: ${user.device}<br>
            Quality: ${user.quality}<br>
            Activity: ${user.activity}
        `;
        
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
        tooltip.classList.remove('hidden');
    }

    hideTooltip() {
        this.tooltip.classList.add('hidden');
    }

    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        document.getElementById('start-simulation').disabled = true;
        document.getElementById('stop-simulation').disabled = false;
        
        this.addEvent('info', 'Simulation started');
        
        // Start simulation loops
        this.metricsInterval = setInterval(() => this.updateMetrics(), 1000);
        this.networkInterval = setInterval(() => this.updateNetworkTopology(), 2000);
        this.eventInterval = setInterval(() => this.generateRandomEvent(), 3000);
    }

    stopSimulation() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        document.getElementById('start-simulation').disabled = false;
        document.getElementById('stop-simulation').disabled = true;
        
        // Clear intervals
        clearInterval(this.metricsInterval);
        clearInterval(this.networkInterval);
        clearInterval(this.eventInterval);
        
        this.addEvent('warning', 'Simulation stopped');
    }

    updateMetrics() {
        if (!this.isRunning) return;
        
        this.simulationTime += 1;
        
        // Update basic metrics with realistic variations
        const baseLatencies = {
            gold: 18.5,
            silver: 87.3,
            bronze: 245.1
        };
        
        const scenarioModifiers = {
            normal: { latency: 1.0, pdr: 1.0, throughput: 1.0 },
            'high-loss': { latency: 1.5, pdr: 0.85, throughput: 0.7 },
            'node-churn': { latency: 1.2, pdr: 0.9, throughput: 0.8 },
            'mmwave-blockage': { latency: 1.8, pdr: 0.75, throughput: 0.6 }
        };
        
        const modifier = scenarioModifiers[this.currentScenario];
        const variation = () => 0.9 + Math.random() * 0.2; // ±10% variation
        
        // Update latencies
        const goldLatency = (baseLatencies.gold * modifier.latency * variation()).toFixed(1);
        const silverLatency = (baseLatencies.silver * modifier.latency * variation()).toFixed(1);
        const bronzeLatency = (baseLatencies.bronze * modifier.latency * variation()).toFixed(1);
        
        document.getElementById('gold-latency').textContent = goldLatency + 'ms';
        document.getElementById('silver-latency').textContent = silverLatency + 'ms';
        document.getElementById('bronze-latency').textContent = bronzeLatency + 'ms';
        
        // Update PDR
        const goldPdr = (99.95 * modifier.pdr * variation()).toFixed(2);
        const silverPdr = (99.2 * modifier.pdr * variation()).toFixed(1);
        const bronzePdr = (97.8 * modifier.pdr * variation()).toFixed(1);
        
        document.getElementById('gold-pdr').textContent = goldPdr + '%';
        document.getElementById('silver-pdr').textContent = silverPdr + '%';
        document.getElementById('bronze-pdr').textContent = bronzePdr + '%';
        
        // Update throughput
        const throughput = (156.7 * modifier.throughput * variation()).toFixed(1);
        document.getElementById('throughput-value').textContent = throughput + ' Mbps';
        
        // Update FL metrics
        const currentRound = parseInt(document.getElementById('current-fl-round').textContent);
        if (Math.random() < 0.1) { // 10% chance to advance round
            const newRound = currentRound + 1;
            const accuracy = Math.min(95, 75 + newRound * 0.8 + Math.random() * 5).toFixed(1);
            document.getElementById('current-fl-round').textContent = newRound;
            document.getElementById('global-accuracy').textContent = accuracy + '%';
            document.getElementById('fl-round').textContent = newRound;
        }
        
        // Update participating nodes
        const participatingNodes = Math.floor(6 + Math.random() * 3);
        document.getElementById('participating-nodes').textContent = participatingNodes + '/8';
        
        // Update communication cost
        const commCost = (2.0 + Math.random() * 1.0).toFixed(1);
        document.getElementById('comm-cost').textContent = commCost + ' MB';
        
        // Update XR users count
        const xrUserCount = Math.floor(140 + Math.random() * 20);
        document.getElementById('xr-users').textContent = xrUserCount;
        
        // Update advanced parameters
        document.getElementById('gen-size').textContent = Math.floor(60 + Math.random() * 10);
        document.getElementById('decode-prob').textContent = (96 + Math.random() * 4).toFixed(1) + '%';
        
        // Update SLA status indicators
        this.updateSLAStatus(goldLatency, silverLatency, bronzeLatency, goldPdr, silverPdr, bronzePdr);
    }

    updateSLAStatus(goldLatency, silverLatency, bronzeLatency, goldPdr, silverPdr, bronzePdr) {
        const goldCard = document.querySelector('.priority-gold .status');
        const silverCard = document.querySelector('.priority-silver .status');
        const bronzeCard = document.querySelector('.priority-bronze .status');
        
        // Gold SLA check
        if (parseFloat(goldLatency) <= 20 && parseFloat(goldPdr) >= 99.9) {
            goldCard.className = 'status status--success';
            goldCard.textContent = 'SLA Met';
        } else {
            goldCard.className = 'status status--error';
            goldCard.textContent = 'SLA Violated';
        }
        
        // Silver SLA check
        if (parseFloat(silverLatency) <= 100 && parseFloat(silverPdr) >= 99.0) {
            silverCard.className = 'status status--success';
            silverCard.textContent = 'SLA Met';
        } else {
            silverCard.className = 'status status--warning';
            silverCard.textContent = 'SLA Warning';
        }
        
        // Bronze SLA check
        if (parseFloat(bronzeLatency) <= 500 && parseFloat(bronzePdr) >= 95.0) {
            bronzeCard.className = 'status status--success';
            bronzeCard.textContent = 'SLA Met';
        } else if (parseFloat(bronzeLatency) <= 600) {
            bronzeCard.className = 'status status--warning';
            bronzeCard.textContent = 'Near Limit';
        } else {
            bronzeCard.className = 'status status--error';
            bronzeCard.textContent = 'SLA Violated';
        }
    }

    updateNetworkTopology() {
        if (!this.isRunning) return;
        
        // Update node status and performance randomly
        this.nodes.forEach(node => {
            node.cpu = Math.max(0.1, Math.min(0.95, node.cpu + (Math.random() - 0.5) * 0.1));
            node.memory = Math.max(0.1, Math.min(0.95, node.memory + (Math.random() - 0.5) * 0.1));
            node.bandwidth = Math.max(0.1, Math.min(0.95, node.bandwidth + (Math.random() - 0.5) * 0.1));
            node.connections = Math.max(10, Math.min(200, node.connections + Math.floor((Math.random() - 0.5) * 10)));
            node.rl_reward = Math.max(0.3, Math.min(1.0, node.rl_reward + (Math.random() - 0.5) * 0.05));
        });
        
        // Update XR users positions slightly
        this.xrUsers.forEach(user => {
            user.x = Math.max(50, Math.min(750, user.x + (Math.random() - 0.5) * 20));
            user.y = Math.max(50, Math.min(550, user.y + (Math.random() - 0.5) * 20));
        });
        
        // Refresh topology visualization
        this.initializeNetworkTopology();
    }

    generateRandomEvent() {
        if (!this.isRunning) return;
        
        const eventTypes = [
            { type: 'info', messages: ['Node handover completed', 'FL round converged', 'RLNC redundancy adjusted', 'XR user joined session'] },
            { type: 'warning', messages: ['High latency detected', 'Node resource utilization high', 'mmWave beam blocked', 'Packet loss threshold exceeded'] },
            { type: 'success', messages: ['SLA target achieved', 'FL accuracy improved', 'Network throughput optimized', 'Edge cache hit rate increased'] },
            { type: 'error', messages: ['Node connection lost', 'RLNC decode failure', 'Critical latency violation', 'Federation timeout'] }
        ];
        
        const weights = { info: 0.4, warning: 0.3, success: 0.2, error: 0.1 };
        const rand = Math.random();
        let cumulative = 0;
        let selectedType = 'info';
        
        for (const [type, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand <= cumulative) {
                selectedType = type;
                break;
            }
        }
        
        const typeData = eventTypes.find(t => t.type === selectedType);
        const message = typeData.messages[Math.floor(Math.random() * typeData.messages.length)];
        
        this.addEvent(selectedType, message);
    }

    addEvent(type, message) {
        const timestamp = new Date().toLocaleTimeString();
        this.events.unshift({ type, message, timestamp });
        
        // Keep only last 20 events
        if (this.events.length > 20) {
            this.events = this.events.slice(0, 20);
        }
        
        this.updateEventLog();
    }

    updateEventLog() {
        const eventLog = document.getElementById('event-log');
        eventLog.innerHTML = this.events.map(event => `
            <div class="event-item">
                <span class="event-time">${event.timestamp}</span>
                <span class="event-type event-${event.type}">${event.type}</span>
                <span class="event-message">${event.message}</span>
            </div>
        `).join('');
    }

    changeScenario(scenario) {
        this.currentScenario = scenario;
        this.addEvent('info', `Scenario changed to: ${scenario}`);
        
        // Immediately reflect scenario changes in network links
        this.networkLinks.forEach(link => {
            if (scenario === 'high-loss' || scenario === 'mmwave-blockage') {
                link.active = Math.random() > 0.5; // More links inactive
            } else if (scenario === 'node-churn') {
                link.active = Math.random() > 0.3; // Some churn
            } else {
                link.active = Math.random() > 0.2; // Normal operation
            }
        });
        
        if (this.isRunning) {
            this.updateNetworkTopology();
        }
    }

    updateRedundancy(value) {
        document.getElementById('redundancy-value').textContent = value;
        document.getElementById('redundancy-display').textContent = value;
        
        if (this.isRunning) {
            this.addEvent('info', `RLNC redundancy factor updated to ${value}`);
        }
    }

    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            scenario: this.currentScenario,
            simulationTime: this.simulationTime,
            metrics: {
                goldLatency: document.getElementById('gold-latency').textContent,
                silverLatency: document.getElementById('silver-latency').textContent,
                bronzeLatency: document.getElementById('bronze-latency').textContent,
                goldPdr: document.getElementById('gold-pdr').textContent,
                silverPdr: document.getElementById('silver-pdr').textContent,
                bronzePdr: document.getElementById('bronze-pdr').textContent,
                throughput: document.getElementById('throughput-value').textContent,
                flRound: document.getElementById('current-fl-round').textContent,
                globalAccuracy: document.getElementById('global-accuracy').textContent
            },
            nodes: this.nodes,
            events: this.events.slice(0, 10) // Last 10 events
        };
        
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flexrnet_results_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.addEvent('success', 'Results exported successfully');
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new FLEXRNetSimulation();
    
    // Add some initial events
    simulation.addEvent('info', 'FLEXRNet simulation system initialized');
    simulation.addEvent('success', 'All edge nodes online and ready');
    simulation.addEvent('info', 'Federated learning agents deployed');
    simulation.addEvent('info', 'RLNC encoding parameters optimized');
    
    // Auto-start simulation after 2 seconds
    setTimeout(() => {
        simulation.startSimulation();
    }, 2000);
    
    // Make simulation globally accessible for debugging
    window.flexrnetSimulation = simulation;
});