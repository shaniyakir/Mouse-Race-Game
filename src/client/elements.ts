import * as THREE from 'three';

export interface Element {
    mesh: THREE.Mesh;
    onClick: () => void;
    setInitialPosition(): void; 
    isCollectible: boolean;
}