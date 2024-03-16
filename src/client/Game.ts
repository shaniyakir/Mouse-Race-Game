import * as THREE from 'three';
import { Collect } from './collect';
import { Change } from './change';
import { Avoid } from './avoid'
import { Element } from './elements';

export class Game {
    private scene!: THREE.Scene;
    public camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private timer: number = 0;
    private timerElement!: HTMLElement;
    private collectElementsLeft: number = 0;
    private animationId: number | null = null; // Variable to store the animation request ID


    constructor() {
        this.initScene();
        this.createElements();
        this.animate();
    }

    private initScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        document.addEventListener('click', this.onMouseClick.bind(this), false);

        this.timerElement = document.createElement('div');
        this.timerElement.style.position = 'absolute';
        this.timerElement.style.top = '20px';
        this.timerElement.style.left = '20px';
        this.timerElement.style.color = 'red'
        document.body.appendChild(this.timerElement);
    }

    

    private createElements() {
        // Example- Create 3 Collect elements ,2 Change elements and 3 Avoid elements
        for (let i = 0; i < 3; i++) {
            new Collect(this.scene);
            this.collectElementsLeft++;
        }
        for (let i = 0; i < 3; i++) {
            new Avoid(this.scene);
        }
        for (let i = 0; i < 2; i++) {
            new Change(this.scene);
            this.collectElementsLeft++;
        }
        console.log("num of items:" + this.collectElementsLeft)
    }

    public removeElement(element: Element) {
        this.scene.remove(element.mesh);
        if (element.isCollectible) {
            this.collectElementsLeft--;
        }else{
            this.gameOver(false); // lose
        }
        if (this.collectElementsLeft === 0 ) {
            this.gameOver(true); // Victory
        }
        console.log(this.collectElementsLeft)
    }

    private animate = () => {
        this.timer++;
        this.timerElement.innerText = `Time: ${Math.floor(this.timer / 60)}s`;
    
        // Move each collect element
        this.scene.traverse((child) => {
            if (child.userData.element instanceof Avoid || child.userData.element instanceof Collect) {
                child.userData.element.move();
            }
        });
    
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(this.animate); // Request the next animation frame

    };
    
    private onMouseClick(event: MouseEvent) {
        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        console.log(this.scene.children);

        for (const intersect of intersects) {
            const element = intersect.object.userData.element;
            if (element) {

                document.addEventListener('click', element.onClick(event));
            }
        }
    }

    public gameOver(isVictory: boolean) {
        this.stopAnimation();
        this.showPopup(isVictory);
    }
    

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    showPopup(victory: boolean) {
        let message = '';
        if (victory) {
            message = 'Congratulations! You won!\nClick to play again.';
        } else {
            message = 'Game Over!\nClick to play again.';
        }
    
        // Create the popup container
        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');
    
        // Create the popup message element
        const popupMessage = document.createElement('div');
        popupMessage.innerText = message;
        popupMessage.classList.add('popup-message');

        // Append the popup message to the popup container
        popupContainer.appendChild(popupMessage);

        // Append the popup container to the document body
        document.body.appendChild(popupContainer);
    
        // Add click event listener to restart the game
        popupMessage.addEventListener('click', (event) => {
            // Stop event propagation to prevent triggering the click event listener on the container
            event.stopPropagation();
            // Remove the popup container
            document.body.removeChild(popupContainer);
            this.startOver();
        });
    }    
        
     startGame() {
        this.animationId = requestAnimationFrame(this.animate);
    }

    public startOver() {
        this.timer = 0;
        this.collectElementsLeft = 0;
        this.removeChildren(this.scene);
        this.createElements();
        this.startGame();
    }

    removeChildren(object: THREE.Object3D) {
        while (object.children.length > 0) {
            this.removeChildren(object.children[0]);
            object.remove(object.children[0]);
        }
    }
}


