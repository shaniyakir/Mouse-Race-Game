import * as THREE from 'three';
import { Element } from './elements';
import { game } from './index'; // Assuming the file name is 'game.ts'

export class Collect implements Element {
    mesh!: THREE.Mesh;
    direction: THREE.Vector3;
    behaviorTimer: NodeJS.Timeout;
    isCollectible: boolean = true;

    constructor(scene: THREE.Scene) {
        this.direction = new THREE.Vector3(1, 0, 0);
        this.createMesh();
        this.setInitialPosition(); // Set initial random position
        scene.add(this.mesh);
        this.mesh.userData.element = this;

        this.behaviorTimer = setInterval(() => this.toggleBehavior(), 2000); // Toggle behavior every 2 seconds
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
        const screenPosition = new THREE.Vector3();
        screenPosition.copy(this.mesh.position);
        screenPosition.project(game.camera);
        
    
        // Check if the object is at or near the right edge of the screen
        const isAtRightEdge = Math.abs(screenPosition.x) > 0.5;
    
        // Filter out the right direction if the object is at the right edge of the screen
        const filteredDirections = isAtRightEdge ? directions.filter(direction => direction.x !== 1) : directions;
    
        // Select a random direction from the filtered directions
        this.direction = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
    }
    

    move() {
        // Move the element in the current direction
        const speed = 0.01; // Adjust speed as needed

        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;

        window.resizeTo(screenWidth, screenHeight);


            // Limit movement within the screen bounds
        // const screenSize = new THREE.Vector2(screenWidth, screenHeight);

        // const elementSize = new THREE.Vector3();

        // let x = this.mesh.position.x;
        // let y = this.mesh.position.y;

        // if (x + elementSize.x / 2 > screenWidth / 100) {
        //     this.mesh.position.x = screenWidth / 2 - elementSize.x / 2;
        // } else if (x - elementSize.x / 2 < -screenWidth / 100) {
        //     this.mesh.position.x = -screenWidth / 2 + elementSize.x / 2;
        // }
    
        // if (y + elementSize.y / 2 > screenHeight / 100) {
        //     this.mesh.position.y = screenHeight / 2 - elementSize.y / 2;
        // } else if (y - elementSize.y / 2 < -screenHeight / 100) {
        //     this.mesh.position.y = -screenHeight / 2 + elementSize.y / 2;
        // }
        this.mesh.position.addScaledVector(this.direction, speed);
    
    }

    onClick() {
        // Remove the collectible element when clicked
        game.removeElement(this);   
    }

    dispose() {
        clearInterval(this.behaviorTimer); // Clear the change direction timer when the element is removed
    }
}
