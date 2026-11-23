const express = require('express');
const pool = require('../db');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');


router.get('/',async (req,res) =>{
    try{
        const [row]= await pool.query('SELECT * FROM products ORDER BY id');
        res.json(row );
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }

});

router.post('/', requireAdmin, async(req,res)=>{
    try{
        const { name,sku,price,stock,reorder_level}=req.body;
        if(!name || !sku || !(Number(price)>0) )
            {
            return res.status(400).json({error:'name, sku and a valid price are required'});
            }
            const  [result] = await pool.query('INSERT INTO products (name,sku,price,stock,reorder_level) VALUES(?,?,?,?,?)',
                [name,sku,price,stock || 0,reorder_level || 5]
             );
             res.status(201).json({ id: result.insertId, name, sku, price});
    }

    catch(err){
        if(err.code=='ER_DUP_ENTRY'){
            return res.status(409).json({error:'SKU already exists'});
            
        }console.error(err);
            res.status(500).json({error:'Server Error'});
        }

    }
);

router.put('/:id', requireAdmin, async(req,res)=>{
    try{
        const {name,sku,price,stock,reorder_level}=req.body;
        if (!name || !sku || !(Number(price)>0)){
            return res.status(400).json({error:'name, sku and a valid price are required'});
        }
        const [result] = await pool.query('UPDATE products SET name=?, sku=?, price=?, stock=?, reorder_level=? WHERE id=?',
            [name,sku,price,stock,reorder_level,req.params.id]);
            if(result.affectedRows===0){
                return res.status(404).json({error:'Product not found'});
            }
            res.json({id:Number(req.params.id),name,sku,price,stock,reorder_level});
        }catch(err){
            if(err.code==='ER_DUP_ENTRY'){
                return res.status(409).json({error:'SKU already exists'});
            }
            console.error(err);
            res.status(500).json({error:'Server Error'});
        }

});

router.delete('/:id', requireAdmin, async(req,res)=>{
    try{
        const [result] = await pool.query('DELETE FROM products WHERE id=?',[req.params.id]);
        if(result.affectedRows===0){
            return res.status(404).json({error:'Product not found'});
        }
        res.json({message:'Product deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Server Error'});
    }
});

module.exports = router;