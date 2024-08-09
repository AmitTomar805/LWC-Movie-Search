import { api, LightningElement } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie;
    @api selectedMovieId;
    clickHandler(event){
        console.log("Clicked",this.movie.imdbID);
        const selectedEvent = new CustomEvent('selectedmovie', {
            detail: this.movie.imdbID
        });
        this.dispatchEvent(selectedEvent);
    }
    get tileSelected(){
        return this.selectedMovieId === this.movie.imdbID? 'tile selected' : 'tile';
    }
}