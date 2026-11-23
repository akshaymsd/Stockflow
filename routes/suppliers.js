const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/',async(req,res) =>{
    try{
        const [row]= await pool.query('SELECT * FROM suppliers ORDER BY id');
        res.json(row);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }
});

router.post('/',async(req,res)=>{
    try{
        const {name , phone}=req.body;
        if(!name){
            return res.status(400).json({error:'name is required'});
        }
        const [result] = await pool.query('INSERT INTO suppliers (name,phone) VALUES(?,?)',[name,phone || null]);
        res.status(201).json({id:result.insertId,name,phone});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }
});

router.put('/:id',async(req,res)=>{
    try{
        const {name,phone}=req.body;
        if(!name){
            return res.status(400).json({error:'name is required'});
        }
        const [result] = await pool.query('UPDATE suppliers SET name=?, phone=? WHERE id=?',[name,phone,req.params.id]);
        if(result.affectedRows===0){
            return res.status(404).json({error:'Supplier not found'});
        }
        res.json({id:Number(req.params.id),name,phone});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }   
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM suppliers WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Supplier not found'
            });
        }

        res.json({
            message: 'Supplier deleted successfully'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server Error'
        });
    }
});


module.exports = router;