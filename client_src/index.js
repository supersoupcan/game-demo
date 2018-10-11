import './style.scss';
import App from './App';

window.document.onreadystatechange = function(){
  switch(document.readyState){
    case 'interactive': {
      const app = new App();
      app.init();
    }
  }
}
