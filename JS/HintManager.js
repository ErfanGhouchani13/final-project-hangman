export class HintManager {
    constructor(hintButtonId, hintPopupId, word) {
        this.hintButton = document.getElementById(hintButtonId);
        this.hintPopup = document.getElementById(hintPopupId);
        this.word = word;
        this.addEventListeners();
    }

    addEventListeners() {
        this.hintButton.addEventListener('click', () => {
            this.displayHint();
        });

        const closeButton = this.hintPopup.querySelector('.close');
        closeButton.addEventListener('click', () => {
            this.hideHint();
        });
    }

    displayHint() {
        this.hintButton.style.display = 'none';
        this.hintPopup.style.display = 'block';
        console.log('It\'s cheating, I know!');
        console.log(this.word);
    }

    hideHint() {
        this.hintPopup.style.display = 'none';
    }
}