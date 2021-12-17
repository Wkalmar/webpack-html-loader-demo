import { ApplicationContext } from "../../applicationContext";
import "./welcome.css"

export class WelcomeControl {
    private welcomeScreenId = "welcome-screen";
    private hideButtonId = "welcome-screen-hide";
    private closeButtonId = "welcome-screen-close";

    private template: string =
        `<div class="welcome" id="${this.welcomeScreenId}">
            <div class="modal-content" style="display: block;">
                <p>The goal is to find as many interesting routes which start and end at a subway station as possible. If you know an interesting or scenic route to share do not hesitate!</p>
                <input id="${this.hideButtonId}" type="checkbox"/>
                <label for="${this.hideButtonId}">Do not show this message again</label>
                <div>
                    <button id="${this.closeButtonId}" class="button-ok">Got it</button>
                </div>
            </div>
        </div>`;

    public render = (): string => {
        if (ApplicationContext.displayWelcomeScreen && !ApplicationContext.alwaysHideWelcomeScreen) {
            return this.template
        }
        return "";
    }

    public removeTemplate = () => {
        const templateContainer = document.getElementById(this.welcomeScreenId);
        if (templateContainer != null) {
            const container = templateContainer as HTMLElement;
            container.remove();
        }
        ApplicationContext.displayWelcomeScreen = false;
    }

    public addEventListeners = () => {
        const closeButton = document.getElementById(this.closeButtonId);
        if (!closeButton) {
            return;
        }
        closeButton.addEventListener('click', this.close);
    }

    private close = () => {
        this.hideControl();
        this.saveUserPreferences();
    }

    private hideControl = () => {
        const templateContainer = document.getElementById(this.welcomeScreenId);
        if (templateContainer == null) {
            return;
        }
        templateContainer.style.display = 'none';
        ApplicationContext.displayWelcomeScreen = false;
    }

    private saveUserPreferences = () => {
        const preferencesCheckBox = document.getElementById(this.hideButtonId) as HTMLInputElement;
        if (preferencesCheckBox == null) {
            return;
        }
        ApplicationContext.alwaysHideWelcomeScreen = preferencesCheckBox.checked;
        window.sessionStorage.setItem(WelcomeControl.hideWelcomeScreensetting,
            ApplicationContext.alwaysHideWelcomeScreen.toString())
    }

    public static hideWelcomeScreensetting: string = 'alwaysHideWelcomeScreen';
}
