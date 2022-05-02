import { DamagableI, DamagingI, DrawableI, DrawableObjectManagerI, isDrawable, isPhysical, ObjectManagerI, PhysicalObject, PhysicalObjectManagerI } from './types.js';

export class ObjectManager implements ObjectManagerI {
    physicalObjects: PhysicalObjectManagerI;
    drawableObjects: DrawableObjectManagerI;

    constructor(physicalObjects: PhysicalObjectManagerI, drawableObjects: DrawableObjectManagerI) {
        this.physicalObjects = physicalObjects;
        this.drawableObjects = drawableObjects;
    }

    push(obj: PhysicalObject | DrawableI): void {
        if(isDrawable(obj)) this.drawableObjects.push(obj);
        if(isPhysical(obj)) this.physicalObjects.push(obj);
    }
}