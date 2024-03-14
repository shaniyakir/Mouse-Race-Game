import * as THREE from 'three';

export class Element {
    type: string;
    collectable: boolean;
    avoidable: boolean;
    changeable: boolean;
    behavior: string;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    direction: THREE.Vector3;
    lastDirectionChangeTime: number;

    constructor(type: string, position: THREE.Vector3) {
        this.type = type;
        this.collectable = type === "Collect";
        this.avoidable = type === "Avoid";
        this.changeable = type === "Change";
        this.behavior = this.collectable ? "Collect" : "Avoid";
        this.geometry = this.createGeometry();
        this.material = this.createMaterial();
        this.mesh = this.createMesh();
        this.mesh.position.copy(position); // Set initial position
        this.direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        this.lastDirectionChangeTime = Date.now();
    }

    private createGeometry(): THREE.BufferGeometry {
        let geometry;
        if (this.type === "Collect") {
            geometry = new THREE.BoxGeometry(Math.random(), Math.random(), Math.random());
        } else if (this.type === "Avoid") {
            geometry = new THREE.SphereGeometry(Math.random() / 2, 32, 32);
        } else if (this.type === "Change") {
            geometry = new THREE.CylinderGeometry(0, Math.random(), Math.random(), 4);
        }
        return geometry as THREE.BoxGeometry | THREE.SphereGeometry | THREE.CylinderGeometry ;
    }

    private createMaterial(): THREE.Material {
        let material;
        if (this.collectable) {
            material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green
        } else {
            material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red
        }
        return material;
    }

    private createMesh(): THREE.Mesh {
        const mesh = new THREE.Mesh(this.geometry, this.material);
        return mesh;
    }

    update() {
        if (this.changeable) {
            this.mesh.rotation.y += 0.01; // Rotate clockwise
        }
        if (this.collectable) {
            // Change direction every 2 seconds
            const currentTime = Date.now();
            if (currentTime - this.lastDirectionChangeTime > 2000) {
                this.direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
                this.lastDirectionChangeTime = currentTime;
            }

            // Move the object
            const speed = 0.01;
            this.mesh.position.addScaledVector(this.direction, speed);
        } else if (this.behavior === "Avoid") {
            // Implement movement for avoidable elements
        }
    }
}
