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
    private changeElementsLeft: number = 0;

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
        // Example: Create 5 Collect elements and 3 Change elements
        for (let i = 0; i < 6; i++) {
            const collectElement = new Collect(this.scene);
            this.collectElementsLeft++;
        }
        for (let i = 0; i < 3; i++) {
            const changeElement = new Avoid(this.scene);
            this.changeElementsLeft++;
        }
        for (let i = 0; i < 3; i++) {
            const changeElement = new Change(this.scene);
            this.changeElementsLeft++;
        }
    }

    public removeElement(element: Element) {
        this.scene.remove(element.mesh);
        if (element instanceof Collect) {
            this.collectElementsLeft--;
        } else if (element instanceof Change) {
            this.changeElementsLeft--;
        }
        if (this.collectElementsLeft === 0 && this.changeElementsLeft === 0) {
            this.gameOver(true); // Victory
        }
    }

    public gameOver(isVictory: boolean) {
        if (isVictory) {
            console.log('Congratulations! You won!');
        } else {
            console.log('Game over! You lost.');
        }
        // Additional game over logic (e.g., display message, reset game)
    }

    private animate() {
        this.timer++;
        this.timerElement.innerText = `Time: ${Math.floor(this.timer / 60)}s`;
            // Move each collect element
        this.scene.traverse((child) => {
            if (child.userData.element instanceof Avoid) {
                child.userData.element.move();
            }
            else if (child.userData.element instanceof Collect){
                child.userData.element.move();
            }

            else{
                //child.userData.element.move();
            }
            
        });
        // Update element positions, handle interactions, etc.

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

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
}


