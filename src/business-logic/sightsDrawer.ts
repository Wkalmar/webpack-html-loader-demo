import { Sight } from '../models/sight';
import "../controllers/sights/sights.css"

export class SightsDrawer {
    private sightsContainerId = "sights-container";
    private sightsControlId = "sights-control";
    private closeButtonId = "sights-control-close";

    public draw = (sights: Sight[]) => {
        const sightsHtml = this.prepareSightsHtml(sights);
        this.drawSights(sightsHtml);
        this.addEventListeners();
    }

    private clearTemplate = () => {
        const controlContainer = document.getElementById(this.sightsControlId);
        if (controlContainer != null) {
            const container = controlContainer as HTMLElement;
            container.remove();
        }
    }

    private addEventListeners = () => {
        const closeButton = document.getElementById(this.closeButtonId);
        if (!closeButton) {
            return;
        }
        closeButton.addEventListener('click', this.clearTemplate);
    }

    static drawer = new SightsDrawer();

    private drawSights(sightsHtml: string) {
        const sightsContainer = document.getElementById(this.sightsContainerId);
        if (sightsContainer == null) {
            throw new Error('Invalid html. Page should contain element with id sights-container');
        }
        const container = sightsContainer as HTMLElement;
        container.insertAdjacentHTML('beforebegin', sightsHtml);
    }

    private prepareSightsHtml(sights: Sight[]) {
        this.clearTemplate();
        this.addEventListeners();
        const sightCards = sights.map(s => `<div>
                <a href="${s.links[0]}">${s.name || s.localizedName}</a>
                <img src="${s.imageLink}"/>
            </div>`);
        let startBlock = `<div id="${this.sightsControlId}" class="sights-control">`;
        startBlock += `<button id="${this.closeButtonId}" class="button-ok">x</button>`;
        let res = "";
        res += sightCards.reduce((acc, s) => acc += s, res);
        const endBlock = "</div>";
        const sightsHtml = startBlock + res + endBlock;
        return sightsHtml;
    }
}