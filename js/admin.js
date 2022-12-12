import {
  campoRequerido,
  validarUrl,
  validarGeneral,
} from "./validaciones.js";

import { Producto } from "./productClass.js"
// traigo los elementos que necesito del html

let campoCodigo = document.getElementById("codigo");
let campoProducto = document.getElementById("producto");
let campoDescripcion = document.getElementById("descripcion");
let campoCategoria = document.getElementById("categoria")
let campoUrl = document.getElementById("url");
// para el evento submit del formulario
let formularioProducto = document.querySelector("#formProducto");


let btnPublicado = document.querySelector("#btnPublicado");
 
let productoExistente = false; //variable bandera: si es false quiere crear producto, si es true modificar producto

// si hay productos en el local storage ,quiero guardar en el array de productos
// y si no que sea un array vacio

let listaProducto = JSON.parse(localStorage.getItem("arrayProductoKey")) || [];
// asociar un evento a cada elemento obtenido


// btn publicado true o false

let juegoPublicado = false ;

console.log(juegoPublicado);


campoProducto.addEventListener("blur", () => {
  campoRequerido(campoProducto);
});

campoDescripcion.addEventListener("blur", () => {
  campoRequerido(campoDescripcion);
});

campoCategoria.addEventListener("blur", () => {
  campoRequerido(campoDescripcion);
});

btnPublicado.addEventListener("click" , () => {
  productoPublicado(juegoPublicado)
})


campoUrl.addEventListener("blur", () => {
  validarUrl(campoUrl);
});

formularioProducto.addEventListener("submit", guardarProducto);



// invoco a carga inicial de lista , si tengo productos en el local storage los muestra en la tabla


cargaInicial()
// logica del crud




function guardarProducto(e) {
  //prevenir el actualizar del submit
  e.preventDefault();
  //verificar que todos los datos sean validos
  if (
    validarGeneral(
      // campoCodigo,
      campoProducto,
      campoDescripcion,
      campoCategoria,
      campoUrl
    )
  ) {
    // console.log("los datos fueron enviados correctamente");
    if (productoExistente === false) {
      //crear producto
      crearProducto();
    } else {
      //modificar producto
      modificarProducto();
    }
  }
}

function crearProducto() {
  // crearCodigoUnico() funcion que retorna un codigo unico
  let codigoUnico = Math.floor(Math.random() * 1000);
  //crear un objeto producto
  let productoNuevo = new Producto(
    codigoUnico,
    campoProducto.value,
    campoDescripcion.value,
    campoCategoria.value,
    juegoPublicado,
    campoUrl.value
  );
  console.log(productoNuevo);
  //guardar cada objeto (producto) en un array de productos
  listaProducto.push(productoNuevo);
  console.log(listaProducto);
  //limpiar formulario
  limpiarFormulario();
  // guardar los productos dentro del localStorage
  guardarLocalStorage()

  //mostrar cartel al usuario 
  Swal.fire(
    'Producto Creado',
    'Su producto fue guardado con exito ',
    'success'
  )
  // cargar productos en  la tabla
  crearFila(productoNuevo)

}



// funcion limpar el formulario 

function limpiarFormulario() {
  formularioProducto.reset();

  //resetear las clases de los imputs

  campoCodigo.className = "form-control";
  campoProducto.className = "form-control";
  campoDescripcion.className = "form-control";
  campoCategoria.className = "form-control";
  campoUrl.className = "form-control";

  //resetear la variable bandera o booleana para el caso de modificarProducto
  productoExistente = false;
};


function guardarLocalStorage() {

  localStorage.setItem("arrayProductoKey", JSON.stringify(listaProducto))

}



function crearFila(producto) {
  let tablaProducto = document.querySelector("#tablaProducto");
  // se usa el operacion de asignacion de adicion para concatenar con las filas que ya tengo

  tablaProducto.innerHTML +=
    `<tr>
  <th >${producto.codigo}</th>
  <td>${producto.producto}</td>
  <td>${producto.descripcion}</td>
  <td>${producto.categoria}</td>
  <td>${producto.publicado}</td>
  <td>${producto.url}</td>
  <td>
  <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#cargarJuego" onclick="prepararEdicionProducto('${producto.codigo}')">
    Editar
  </button>
  <button class="btn btn-dark" onclick="borrarProducto('${producto.codigo}')">
    Borrar
  </button>
</td>

  </tr>
`


}

// cargar la tabla conm los datos existentes del LocalStorage

function cargaInicial() {
  if (listaProducto.length > 0)
    //crear fila 

    listaProducto.forEach((itemProducto) => {
      crearFila(itemProducto)

    });

}



window.prepararEdicionProducto = function (codigo) {
  console.log("desde editar");
  console.log(codigo);
  // buscar el producto en el array 

  let productoBuscado = listaProducto.find((itemProducto) => {

    return itemProducto.codigo == codigo;

  })

  console.log(productoBuscado);
  //mostrar el producto encontrado en el formulario

  campoCodigo.value = productoBuscado.codigo;
  campoProducto.value = productoBuscado.producto;
  campoDescripcion.value = productoBuscado.descripcion;
  campoCategoria.value= productoBuscado.categoria;
    campoUrl.value = productoBuscado.url;
  // cambiar la bandera de producto ecistente


  productoExistente = true;

}

// funcion para alternar el estado del juego Publicado/No publicado
function productoPublicado(producto) {
  
  
  juegoPublicado = true;

if(juegoPublicado) {
  juegoPublicado = "publicado"
} else {
  juegoPublicado ="no Publicado"
}
  
} 


function modificarProducto() {

  console.log("desde modificar producto");
  //  encontrar la posicion del elemento que quiero modificar dentro del array de productos

  console.log(listaProducto);
  console.log(campoCodigo.value);

  let indiceProducto = listaProducto.findIndex((itemProducto) => {

    // con el parseInt convierto a numero el stgring a comparar ya que el codigo generado por "CODIGO UNICO" era num 
    return itemProducto.codigo === parseInt(campoCodigo.value);
  });

  console.log(indiceProducto);
  // modificar los valores dentro de los elementos del array

  listaProducto[indiceProducto].producto = campoProducto.value;
  listaProducto[indiceProducto].descripcion = campoDescripcion.value;
listaProducto[indiceProducto].categoria = campoCategoria.value;

  listaProducto[indiceProducto].url = campoUrl.value;

  // actualizar en el local storage

  guardarLocalStorage();
  // actualizar la tabla -primero borrar 
  borrarTabla();
  // luego actualizarla desde el local storage ya actualizado
  cargaInicial();
  //mostrar cartel al usuario 
  Swal.fire(
    'Producto Modificado',
    'Su producto fue modificado con exito ',
    'success'
  );



  limpiarFormulario();


}

function borrarTabla() {

  let tablaProducto = document.querySelector("#tablaProducto");

  tablaProducto.innerHTML = ' '

}

// preparar para borrar producto
window.borrarProducto = function (codigo) {


  console.log("desde borrar producto");
  console.log(codigo);
  // encontrar la posicion del elemento del array

  //opcion 1
  // let indiceProducto = listaProducto.findIndex((itemProducto) => {

  //  con el parseInt convierto a numero el stgring a comparar ya que el codigo generado por "CODIGO UNICO" era num 
  //   return itemProducto.codigo === parseInt(campoCodigo.value);
  // });

  // listaProducto.splice(indiceProducto,1)
  // opcion 2 usando filter 
Swal.fire({
    title: 'estas seguro que deseas eliminarlo',
    text: "esta accion no podra ser revertida",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar!'
  }).then((result) => {
       if (result.isConfirmed) {

      let nuevaListaProducto = listaProducto.filter((itemProducto) => {
        return itemProducto.codigo !== parseInt(codigo);
      });
    
    
     console.log(nuevaListaProducto);
    
      // actualizar en el arreglo original y el local storage
    
      listaProducto = nuevaListaProducto;
      guardarLocalStorage();
      // actualizar la tabla -primero borrar 
      borrarTabla();
      // luego actualizarla desde el local storage ya actualizado
      cargaInicial();
      //mostrar cartel al usuario 
      Swal.fire(
        'Producto eliminado!',
        "Su producto fue eliminado correctamente",
        'success'
      )
    }
  });

}

