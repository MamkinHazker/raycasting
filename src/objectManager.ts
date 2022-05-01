import { DamagableI, DamagingI, DrawableI, DrawableObjectManagerI, PhysycalObjectManagerI } from './types.js';

export class DrawableObjectManager extends Array<DrawableI> implements DrawableObjectManagerI {

}

export class PhysycalObjectManager extends Array<DamagableI | DamagingI> {

}