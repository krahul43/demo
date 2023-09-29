//* REDUCER QUE MANEJA LA PETICION A LA API CUANDO SE SOLICITA LA INFORMACION DEL USUARIO, CUANDO SE LLAMA A LA API, CCUANDO LA RESPUESTA DE LA API ES EXITOSA Y CUANDO NO
import { 
  GET_DRIVER_API,
  GET_DRIVER_API_SUCCEEDED,
  GET_DRIVER_API_FAILED, 
  DELETE_DRIVER_API,
  SET_DRIVER_API,
  UPDATE_DRIVER_USER
} from '../../types/taxista/actionTypes';

const initialState = {
  loading : false,
  error   : null,
  driver  : null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DRIVER_API:
      return {...state,
        loading : false,
        error   : false,
        driver  : action.payload
      }
    case GET_DRIVER_API:
      return {...state,
        loading : true,
        error   : null,
        driver  : null
      } 
    case GET_DRIVER_API_SUCCEEDED: 
      //console.log('GET USER API SUCCESS :', action.payload);
      return {...state, 
        loading : false,
        error   : null,
        driver  : action.payload,
      };                  
    case GET_DRIVER_API_FAILED:
      return {...state, 
        loading : false,
        error   : action.payload,
        driver  : null,
      };
    case DELETE_DRIVER_API:
      return {...state,
        loading  : false,
        error    : null,
        driver   : null
      };
    case UPDATE_DRIVER_USER:
      return { ...state,
        loading  : false,
        error    : null,
        driver   : action.payload
      };
    default:
      return state; 
  }
};