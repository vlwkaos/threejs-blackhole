// @ts-nocheck
import * as THREE from 'three'
import { Observer } from './Observer';

/**
 * 
 * @param {HTMLElement | Document} domElement 
 * @returns {domElement is HTMLElement}
 */
function isHTMLElement(domElement) {
  return domElement !== document;
}

/**
 * This is a modified pointerlockcontrols.js from THREE.js
 * @member {HTMLElement} domElement
 */
export class CameraDragControls {


  /**
   * 
   * @param {Observer} observer 
   * @param {HTMLElement} domElement 
   */
  constructor(observer, domElement) {
    this.domElement = domElement;
    this.observer = observer;
    let inclineMatrix = (new THREE.Matrix4()).makeRotationZ(this.observer.incline)
    this.observer.up.applyMatrix4(inclineMatrix)

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.enabled = true;

    this.lookSpeed = 0.005;
    this.lookVertical = true;

    this.offsetX = 0
    this.offsetY = 0
    this.lastX = 0
    this.lastY = 0

    this.pitch = 0
    this.yaw = 0
    this.roll = -1

    this.viewHalfX = 0
    this.viewHalfY = 0


    if (isHTMLElement(this.domElement)) {
      this.domElement.setAttribute('tabindex', '-1');
    }

    this.addMouseEventHandlers();
    this.handleResize();
  }

  //
  handleResize() {
    if (!isHTMLElement(this.domElement)) {
      this.viewHalfX = window.innerWidth / 2;
      this.viewHalfY = window.innerHeight / 2;
    } else {
      this.viewHalfX = this.domElement.offsetWidth / 2;
      this.viewHalfY = this.domElement.offsetHeight / 2;
    }

    this.observer.setDirection(this.pitch, this.yaw);
  };

  update(delta) {

    if (this.enabled === false) return;

    if (this.observer.angularVelocity > 0)
      this.yaw += this.observer.angularVelocity * delta

    if (this.mouseDragOn) {
      this.yaw += this.lookSpeed * this.offsetX;

      if (this.lookVertical) {
        this.pitch += this.lookSpeed * this.offsetY;
        this.pitch = Math.min(Math.PI / 2 - 0.01, Math.max(-Math.PI / 2 + 0.01, this.pitch))

      }
      this.offsetX /= 2;
      this.offsetY /= 2;
    }

    this.observer.setDirection(this.pitch, this.yaw);
  }


  addMouseEventHandlers() {
    this.domElement.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this.domElement.addEventListener('mousemove', (event) => {

      // calculate moved position
      if (this.mouseDragOn) {
        let newX, newY;
        if (!isHTMLElement(this.domElement)) {
          newX = event.pageX - this.viewHalfX;
          newY = event.pageY - this.viewHalfY;
        } else {
          newX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
          newY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        }

        this.offsetX = newX - this.lastX;
        this.offsetY = newY - this.lastY;
        this.lastX = newX;
        this.lastY = newY;
      }
    });

    this.domElement.addEventListener('mousedown', event => {
      if (isHTMLElement(this.domElement)) {
        this.domElement.focus();
      }
      event.preventDefault();
      event.stopPropagation();
      this.mouseDragOn = true;
      // remember current mouse position
      if (!isHTMLElement(this.domElement)) {
        this.lastX = event.pageX - this.viewHalfX;
        this.lastY = event.pageY - this.viewHalfY;
      } else {
        this.lastX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
        this.lastY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
      }
    });

    this.domElement.addEventListener('mouseup', (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.mouseDragOn = false;
      this.offsetX = 0;
      this.offsetY = 0;
    });
  }

};