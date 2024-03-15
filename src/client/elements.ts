import * as THREE from 'three';

export interface Element {
    mesh: THREE.Mesh;
    onClick: () => void;
    setInitialPosition(): void; // Add this method to set the initial position
    //move():void
}