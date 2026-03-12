const express = require('express');
const { error } = require('node:console');
const app = express();
const port = 3000;

app.use(express.json());

let bancos = [
    {
        id: 1,
        nombre: "Banreservas",
        personas: [
            { id: 101, nombre: "Juan Perez", edad: 30, cuenta: "960-012345-1" },
            { id: 102, nombre: "Maria Garcia", edad: 20, cuenta: "960-056789-2" },
            { id: 103, nombre: "Carlos Sanchez", edad: 45, cuenta: "960-011223-3" },
            { id: 104, nombre: "Ana Martinez", edad: 28, cuenta: "960-044556-4" }
        ]
    },
    {
        id: 2,
        nombre: "Banco BHD",
        personas: [
            { id: 105, nombre: "Luis Rodriguez", edad: 21, cuenta: "150-098765-5" },
            { id: 106, nombre: "Selena Gomez", edad: 33, cuenta: "150-043210-6" },
            { id: 107, nombre: "Roberto Diaz", edad: 50, cuenta: "150-088997-7" }
        ]
    }
];

app.get ('/banco', (req,res) => {
    res.json (bancos);
})

app.get ('/banco/:id', (req,res) =>{
    const banco= bancos.find(b => b.id === parseInt (req.params.id));
    banco ? res.json(banco) : res.status(404).json ({error: "Banco no encontrado"})
});

app.get ('/banco/:id/personas/:idPersona', (req,res) =>{
    const banco= bancos.find(b => b.id === parseInt (req.params.id));
    if (banco) {
        const persona = banco.personas.find (p => p.id === parseInt(req.params.idPersona));
        persona ? res.json(persona) : res.status(404).json ({error: "Persona no encontrado"});

    } else {
        res.status(404).json ({error: "Banco no encontrado"});
    }

});

app.post ('/banco', (req,res) => {
    const nuevoBanco= {
        id: bancos.length +1,
        nombre: req.body.nombre,
        personas:[]
    };
    bancos.push (nuevoBanco);
    res.status(201).json(nuevoBanco);
});

app.post ('/banco/:id/personas', (req,res) =>{
   const banco = bancos.find(b => b.id === parseInt (req.params.id));
   if (banco) {
      const nuevaPersona = {
        id: Date.now(),
        nombre: req.body.nombre,
        edad: req.body.edad,
        cuenta: req.body.cuenta
      };
      banco.personas.push (nuevaPersona);
      res.status(201).json (nuevaPersona);
   } else {
    res.status(404).json ({error: "Banco no encontrado"});
   }
});

app.put('/banco/:id/personas/:idPersona', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (banco) {
        const persona = banco.personas.find(p => p.id === parseInt(req.params.idPersona));
        if (persona) {
            persona.nombre = req.body.nombre || persona.nombre;
            persona.edad = req.body.edad || persona.edad;
            persona.cuenta = req.body.cuenta || persona.cuenta; 
            res.json(persona);
        } else {
            res.status(404).json({ error: "Persona no encontrada" });
        }
    } else {
        res.status(404).json({ error: "Banco no encontrado" });
    }
});

app.delete('/banco/:id/personas/:idPersona', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (banco) {
        const longitudOriginal = banco.personas.length;
        banco.personas = banco.personas.filter(p => p.id !== parseInt(req.params.idPersona));
        
        if (banco.personas.length < longitudOriginal) {
            res.json({ mensaje: "Persona eliminada correctamente" });
        } else {
            res.status(404).json({ error: "Persona no encontrada" });
        }
    } else {
        res.status(404).json({ error: "Banco no encontrado" });
    }
});

app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:3000`);
});