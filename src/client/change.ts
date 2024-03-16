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
        this.size = Math.random(); 
        this.rotationSpeed = 0.01; // Rotation speed in radians per frame
        this.isCollectible = false; // Initially set as avoidable
        this.createMesh();
        this.setInitialPosition(); 
        scene.add(this.mesh);
        this.mesh.userData.element = this;

        this.behaviorTimer = setInterval(() => this.toggleBehavior(), 1000); // Toggle behavior every 5 seconds
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
        const rotationDegree = -1; // Adjust rotation speed as needed
        const axis = new THREE.Vector3(0, 0, 1); // Rotate around the z-axis 
        this.mesh.rotateOnAxis(axis, rotationDegree);
    }
    
    toggleColor() {
        this.isCollectible = !this.isCollectible; 
        const color = this.isCollectible ? 0x00ff00 : 0xff0000; // Green or red
        (this.mesh.material as THREE.MeshBasicMaterial).color.set(color);
    }

    onClick() {
        if (this.isCollectible) {
            // If it's collectible (green), remove it
            game?.removeElement(this);
        } else {
            // If it's avoidable (red), trigger game over
            game?.gameOver(false);
        }
    }

    dispose() {
        clearInterval(this.behaviorTimer); // Clear the behavior timer when the element is removed
    }
}