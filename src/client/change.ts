import * as THREE from 'three';
import { Element } from './elements';
import {game} from './index'

export class Change implements Element {
    mesh!: THREE.Mesh;
    size: number;
    rotationSpeed: number;
    isCollectible: boolean;
    behaviorTimer: NodeJS.Timeout;

    constructor(scene: THREE.Scene) {
        this.size = Math.random(); // Example for size initialization
        this.rotationSpeed = 0.01; // Rotation speed in radians per frame
        this.isCollectible = false; // Initially set as avoidable
        this.createMesh();
        this.setInitialPosition(); // Set initial random position
        scene.add(this.mesh);
        this.mesh.userData.element = this;

        this.behaviorTimer = setInterval(() => this.toggleBehavior(), 5000); // Toggle behavior every 5 seconds
    }
    setInitialPosition(): void {
        const range = 10; // Adjust range as needed
        this.mesh.position.x = Math.random() * range - range / 2;
        this.mesh.position.y = Math.random() * range - range / 2;
        this.mesh.position.z = Math.random() * range - range / 2;
    }

    createMesh() {
        const geometry = new THREE.CylinderGeometry(0, this.size, this.size, 4);
        const material = new THREE.MeshBasicMaterial({ color: this.isCollectible ? 0x00ff00 : 0xff0000 }); // Green or red
        this.mesh = new THREE.Mesh(geometry, material);
    }


    toggleBehavior() {
        this.toggleColor();
    
        // Rotate the mesh clockwise
        const rotationSpeed = 0.05; // Adjust rotation speed as needed
    
        // Apply rotation
        const axis = new THREE.Vector3(0, 1, 0); // Rotate around the y-axis (up direction)
        this.mesh.rotateOnAxis(axis, rotationSpeed);
    }
    

    toggleColor() {
        this.isCollectible = !this.isCollectible; // Toggle between collectible and avoidable
        const color = this.isCollectible ? 0x00ff00 : 0xff0000; // Green or red
        (this.mesh.material as THREE.MeshBasicMaterial).color.set(color);
    }

    // move(){
    //     this.mesh.rotateX = (1,0,0);
    // }

    onClick() {
        if (this.isCollectible) {
            // If it's collectible (green), remove it
            game.removeElement(this);
        } else {
            // If it's avoidable (red), trigger game over
            game.gameOver(false);
        }
    }

    dispose() {
        clearInterval(this.behaviorTimer); // Clear the behavior timer when the element is removed
    }
}