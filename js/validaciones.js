// validaciones Perrrros

export const campoRequerido = (input) => {
    // console.log('desde campo requerido');
    // console.log(input.value);
  
    if (input.value.trim().length > 0) {
      // console.log("todo bien");
      input.className = "form-control is-valid";
      return true;
    } else {
      // console.log("aqui muestro un error");
      input.className = "form-control is-invalid";
      return false;
    }
  };
  ////////////////////////
  

  
  /////////////////
  
  export const validarUrl = (input) => {
    // vamos a crear una expresion regular, guardar en una variable
  
    let patron = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  
    // el metodo test te devuelve true o false si matchea o no
    //regex.test(string a validar)
  
    if (patron.test(input.value)) {
      // cuando se cumpla con el match
      input.className = "form-control is-valid";
      return true;
    } else {
      input.className = "form-control is-invalid";
      return false;
    }
  };
  
  export const validarGeneral = (
    // campoCodigo,
    campoProducto,
    campoDescripcion,
    campoCategoria,
      campoUrl
  ) => {
    //comprobar que pasen cada una validaciones y si no pasan mostrar el alert
    // console.log('desde validar general');
    //console.log(e);
    let alerta = document.querySelector("#msjAlerta");
    if (
       campoRequerido(campoProducto) &&
      campoRequerido(campoDescripcion) &&
      campoRequerido(campoCategoria) &&
      validarUrl(campoUrl)
    ) {
      alerta.className = "alert alert-danger mt-4 d-none";
      return true;
    } else {
      console.log("validación incorrecta");
      alerta.className = "alert alert-danger mt-4";
      return false;
    }
  };