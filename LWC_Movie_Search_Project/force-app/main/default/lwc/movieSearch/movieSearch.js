import { LightningElement,wire} from 'lwc';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
const DELAY = 300;
export default class MovieSearch extends LightningElement {

    @wire(MessageContext)
    messageContext;
    selectedType="";
    isLoading = false;
    selectedSearch = "";
    selectedPageNo = 1;
    delayTimeout;
    searchResult=[];
    selectedMovie="";
    get typeOptions() {
        return [
            { label: 'None', value: '' },
            { label: 'Movie', value: 'movie' },
            { label: 'Series', value: 'series' },
            { label: 'Episode', value: 'episode' },
        ];
    }
    handleChange(event) {
        let {name, value} = event.target;
        if(name === 'type'){
            this.selectedType = value;
        }
        else if(name === 'search'){
            this.selectedSearch = value;
            this.isLoading = true;
        }
        else if(name === 'pageno'){
            this.selectedPageNo = value;
        }
        //debouncing
        if(this.delayTimeout){
            clearTimeout(this.delayTimeout);
        }
        this.delayTimeout=setTimeout(()=>{
            this.searchMovie();
        }, DELAY);
    }
    async searchMovie(){
        const url=`https://www.omdbapi.com/?s=${this.selectedSearch}&type=${this.selectedType}&page=${this.selectedPageNo}&apikey=60e74ecf`;
        console.log("URL",url);
        const res=await fetch(url);
        const data=await res.json();
        this.isLoading = false;
        console.log("Movie Search Output",data);
        if(data.Response === 'True'){
            this.searchResult = data.Search;
        }
        else{
            this.searchResult = [];
        }
    }
    get displaySearchResult(){
        return this.searchResult.length > 0;
    }
    handleSelectedMovie(event){
        console.log("Event Detail",event.detail);
        this.selectedMovie = event.detail;
        const payload = { movieId: this.selectedMovie };

        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }
}