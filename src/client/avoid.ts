import * as THREE from 'three';
import { Element } from './elements';
import { game } from './index'; 

export class Avoid implements Element {
    mesh!: THREE.Mesh;
    direction: THREE.Vector3;
    behaviorTimer: NodeJS.Timeout;
    isCollectible: boolean = false;

    constructor(scene: THREE.Scene) {
        this.direction = new THREE.Vector3(Math.random() - 0.5, 0, 0).normalize(); // Initial direction (random left or right)
        this.createMesh();
        this.setInitialPosition(); 
        scene.add(this.mesh);
        this.mesh.userData.element = this;

        this.behaviorTimer = setInterval(() => this.toggleBehavior(), 3000); // Toggle behavior every 3 seconds
    }

    setInitialPosition(): void {
        const range = 10; // Adjust range as needed
        this.mesh.position.x = Math.random() * range - range / 2;
        this.mesh.position.y = Math.random() * range - range / 2;
        this.mesh.position.z = Math.random() * range - range / 2;
    }

    createMesh() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
        this.mesh = new THREE.Mesh(geometry, material);
    }

    changeDirection() {
        // Change direction to a random left or right direction
        const randomDirection = Math.random() < 0.5 ? -1 : 1;
        this.direction.set(randomDirection, 0, 0).normalize();
    }



    toggleBehavior() {
        // Change movement direction every 2 seconds
        const directions = [
            new THREE.Vector3(1, 0),   // Right
            new THREE.Vector3(-1, 0),  // Left

        ];
        this.direction = directions[Math.floor(Math.random() * directions.length)];
    }

    move() {
        // Move the element in the current direction
        const speed = 0.01; // Adjust speed as needed
        this.mesh.position.addScaledVector(this.direction, speed); 
    }

    onClick() {
        // Trigger game over if clicked
        game?.gameOver(false);
    }

    dispose() {
        clearInterval(this.behaviorTimer); // Clear the change direction timer when the element is removed
    }
}
