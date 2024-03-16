import * as THREE from 'three';
import { Element } from './elements';
import { game } from './index'; // Assuming the file name is 'game.ts'

export class Collect implements Element {
    mesh!: THREE.Mesh;
    direction: THREE.Vector3;
    behaviorTimer: NodeJS.Timeout;
    isCollectible: boolean = true;

    constructor(scene: THREE.Scene) {
        this.direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        this.createMesh();
        this.setInitialPosition(); // Set initial random position
        scene.add(this.mesh);
        this.mesh.userData.element = this;

        this.behaviorTimer = setInterval(() => this.changeDirection(), 2000); // Toggle behavior every 2 seconds
    }

    setInitialPosition(): void {
        const range = 5; // Adjust range as needed
        this.mesh.position.x = Math.random() * range - range / 2;
        this.mesh.position.y = Math.random() * range - range / 2;
        this.mesh.position.z = Math.random() * range - range / 2;
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
        this.mesh = new THREE.Mesh(geometry, material);
    }

    changeDirection() { 
        this.direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    }

    toggleBehavior() {
        const directions = [
            new THREE.Vector3(1, 0, 0),   // Right
            new THREE.Vector3(-1, 0, 0),  // Left
            new THREE.Vector3(0, 1, 0),   // Up
            new THREE.Vector3(0, -1, 0),  // Down
            new THREE.Vector3(0, 0, 1),   // Forwards
            new THREE.Vector3(0, 0, -1),  // Backwards
        ];
        // Get the screen position of the object
        this.direction = directions[Math.floor(Math.random() * directions.length)];
    }
    
    move() {
        // Move the element in the current direction
        const speed = 0.01; // Adjust speed as needed
        this.mesh.position.addScaledVector(this.direction, speed);
    
    }

    onClick() {
        // Remove the collectible element when clicked, or do nothing if game is null
        game?.removeElement(this);
    }
    

    dispose() {
        clearInterval(this.behaviorTimer); // Clear the change direction timer when the element is removed
    }
}
