import { LightningElement } from 'lwc';
const DELAY = 300;
export default class MovieSearch extends LightningElement {
    selectedType="";
    isLoading = false;
    selectedSearch = "";
    selectedPageNo = 1;
    delayTimeout;
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
        this.isLoading = true;
        if(name === 'type'){
            this.selectedType = value;
        }
        else if(name === 'search'){
            this.selectedSearch = value;
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
        console.log("Movie Search Output",data);
    }
}