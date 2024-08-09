import { LightningElement,wire } from 'lwc';
import {
    APPLICATION_SCOPE,
    createMessageContext,
    MessageContext,
    publish,
    releaseMessageContext,
    subscribe,
    unsubscribe,
} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
export default class MovieDetails extends LightningElement {
    @wire(MessageContext)
    messageContext;
    subscription = null;
    movieDetails=[];
    loadDetails = false;
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    handleMessage(message) {
        let movieId = message.movieId;
        console.log("Movie ID",movieId);
        this.fetchMovieDetails(movieId);
    }
    async fetchMovieDetails(movieId) {
        const url=`https://www.omdbapi.com/?&i=${movieId}&plot=full&apikey=60e74ecf`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("Movie Details",data);
        if(data.Response === 'True'){
            this.movieDetails = data;
            this.loadDetails = true;
        }
        else{
            this.movieDetails = [];
        }
    }
}