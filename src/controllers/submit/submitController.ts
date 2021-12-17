import { Route } from '../../models/route';
import { IController } from "../../icontroller";
import { RouteDrawer } from "../../business-logic/routeDrawer";
import { ControllersEngine } from '../../controllersEngine';
import { ApplicationContext } from '../../applicationContext';
import { StartStationControl } from './startStationControl';
import { Property } from '../../utils/property';

declare const process: any;

export class SubmitController extends IController {
    constructor() {
        super();
    }

    path = "submit";

    private startStationControl: StartStationControl = new StartStationControl();

    private submitModalId: string = "submit-modal";
    private submitModalFormId : string = "submit-modal-form";
    private routeNameInputId : string = "route-name";
    private routeDescriptionInputId : string = "route-description";
    private submitButtonId : string = "route-submit-button";
    private submitSuccessNotificationContainerId : string = "submit-modal-success";
    private gotoHomeButtonId : string = "route-submit-goto-home";

    template =
        `${this.startStationControl.template}
        <div id="${this.submitModalId}" class="modal">
            <div id="${this.submitModalFormId}">
                <div class="modal-content">
                    <div>
                        <label for="${this.routeNameInputId}">Name</label>
                        <input type="text" id="${this.routeNameInputId}" placeholder="Enter route name...">
                    </div>
                    <div>
                        <label for="${this.routeDescriptionInputId}">Desctiption</label>
                        <input type="text" id="${this.routeDescriptionInputId}" placeholder="Tell us why do you like this route">
                    </div>
                    <button id="${this.submitButtonId}">Submit</button>
                </div>
            </div>
            <div id="${this.submitSuccessNotificationContainerId}" class="modal-content" style="display: none;">
                Thank you for submitting your route. It will be published afrer being reviewed by members of our community.
                <button id="${this.gotoHomeButtonId}" class="button-ok">Go to home page</button>
            </div>
        </div>`

    private routeToSubmit: Route;


    private addSubmitFormEventListeners = () => {
        const submitButton = document.getElementById(this.submitButtonId);
        if (submitButton != null)
            submitButton.addEventListener('click', this.submit);

        const goToHomeButton  = document.getElementById(this.gotoHomeButtonId);
        if (goToHomeButton != null)
            goToHomeButton.addEventListener('click', this.goToHome);
    }

    private showSubmitModal = (e: CustomEvent) => {
        const modal = document.getElementById(this.submitModalId);
        if (modal) {
            modal.style.display = 'block';
            this.routeToSubmit = e.detail;
        }
    }

    private goToHome = () => {
        ControllersEngine.go('home');
    }

    private addDrawingSubmittedEventListener = () => {
        document.addEventListener('drawingSubmitted', this.showSubmitModal);
    }

    private addHypotheticalPoint = (e: L.LeafletEvent) => {
        const mouseEvent = e as L.LeafletMouseEvent;
        const routeDrawer = RouteDrawer.drawer;
        routeDrawer.addHypotheticalPoint(mouseEvent.latlng.lat, mouseEvent.latlng.lng);
    }

    private addPoint = (e: L.LeafletEvent) => {
        const mouseEvent = e as L.LeafletMouseEvent;
        const routeDrawer = RouteDrawer.drawer;
        routeDrawer.addPoint(mouseEvent.latlng.lat, mouseEvent.latlng.lng);
    }

    private addMapEventListeners = () => {
        ApplicationContext.map.addEventListener('mousemove', this.addHypotheticalPoint);
        ApplicationContext.map.addEventListener('click', this.addPoint);
    }

    go = () => {
        this.addControllerTemplate();
        this.addMapEventListeners();
        this.addDrawingSubmittedEventListener();
        this.addSubmitFormEventListeners();
        this.startStationControl.addEventListeners();
    }

    removeControllerTemplate = () => {
        const controllerTemplateContainer = document.getElementById(this.submitModalId);
        if (controllerTemplateContainer != null) {
            const container = controllerTemplateContainer as HTMLElement;
            container.remove();
        }
        this.startStationControl.removeTemplate();
    }

    private removeSubmitFormEventListeners = () => {
        const submitButton = document.getElementById(this.submitButtonId);
        if (submitButton != null)
            submitButton.removeEventListener('click', this.submit);

        const goToHomeButton  = document.getElementById(this.gotoHomeButtonId);
        if (goToHomeButton != null)
            goToHomeButton.addEventListener('click', this.goToHome);
    }

    private removeMapEventListeners = () => {
        ApplicationContext.map.removeEventListener('mousemove', this.addHypotheticalPoint);
        ApplicationContext.map.removeEventListener('click', this.addPoint);
    }

    private removeDrawingSubmittedeventListener = () => {
        document.removeEventListener('click', this.showSubmitModal);
    }

    clear = () => {
        this.startStationControl.removeEventListeners();
        this.removeMapEventListeners();
        this.removeSubmitFormEventListeners();
        this.removeDrawingSubmittedeventListener();
        this.removeControllerTemplate();
    }

    private showSuccessNotification = () => {
        const submitSuccessNotificationContrainer = document.getElementById(this.submitSuccessNotificationContainerId);
        const submitFormContainer = document.getElementById(this.submitModalFormId);

        if (!submitFormContainer || !submitSuccessNotificationContrainer) {
            throw new Error("Invalid markup. Expected to have form container and successfull notification container");
        }

        (submitFormContainer as HTMLElement).style.display = 'none';
        (submitSuccessNotificationContrainer as HTMLElement).style.display = 'block';
    }

    private submit = async () => {
        const nameInput = document.getElementById(this.routeNameInputId) as HTMLInputElement;
        const inputText = nameInput && nameInput.value;
        if (!inputText) {
            alert('enter route name');
            return;
        }
        const descriptionInput = document.getElementById(this.routeDescriptionInputId) as HTMLInputElement;
        const descriptionText = descriptionInput && descriptionInput.value;
        this.routeToSubmit.name = Property.set(this.routeToSubmit.name, ApplicationContext.currentLang, inputText as string);
        this.routeToSubmit.description = Property.set(this.routeToSubmit.description, ApplicationContext.currentLang, descriptionText || '');        
        await fetch('/route', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.routeToSubmit)
        })
        this.showSuccessNotification();
    }
}
