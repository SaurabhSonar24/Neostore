const express = require("express")
const productmodel = require("../db/ProductsSchema")

/////////////////////////////////////////////Fetch Products in Home Component
const Popular = (req, res) => {
   productmodel.find({}, { product_name: 1, product_image: 1, product_rating: 1, product_cost: 1, product_producer: 1 }, (err, data) => {
      if (err) throw err;
      //   res.send(data)
      let final = []
      for (let i = 0; i < 6; i++) {
         final.push(data[i])
      }
      res.json({ data1: final })
   }).sort({ product_rating: -1 })
}
////////////////////////////////////////Fetch All Products in Products Component
const All = (req, res) => {
   productmodel.find({}, { product_name: 1, product_image: 1, product_rating: 1, product_cost: 1, product_producer: 1 }, (err, data) => {
      if (err) throw err;
      //   res.send(data)
      res.json({ data1: data })
   })
}
//////////////////////////////////////Fetch ProductDetails Component
const SingleProduct = (req, res) => {


   let id = req.params.id

   productmodel.findOne({ _id: id })
      .populate("color_id")
      .then(product => {
         console.log(product);

         res.json({ data1: product, err: "0", image: product.product_subImages })

      })


}
/////////////////////////////////////Filter data
const filter = (req, res) => {


   let cat = req.params.cat
   let col = req.params.col

   if (cat == "dummy") {
      productmodel.find({ color_id: col })
         .populate()
         .then(product => {
            console.log("col")
            console.log(product);

            res.json({ data1: product, err: "0" })

         })
   }
   else if (col == "dummy") {
      productmodel.find({ category_id: cat })
         .populate()
         .then(product => {
            console.log("cat")
            console.log(product);

            res.json({ data1: product, err: "0" })

         })
   }
   else {
      productmodel.find({ category_id: cat, color_id: col })
         .populate()
         .then(product => {
            console.log("col and cat")
            console.log(product);

            res.json({ data1: product, err: "0" })

         })
   }

}
//////////////////////Edit Rating
const giverating = (req, res) => {
   let rating = req.body.rating;
   let id = req.body.id

   productmodel.findOne({ _id: id }, { product_rating: 1 }, (err, data) => {
      if (err) throw err;
     
      let new_rating = 0;
      new_rating = (data.product_rating + rating) / 2
    
      productmodel.updateOne({ _id: id }, { $set: { "product_rating": new_rating } }, (err, data) => {
         if (err) throw err;
         if (data.matchedCount == 1) {

            res.json({ "err": 0, "msg": "Product Has been successfully rated " })
         }

      })
   })

}


module.exports = { Popular, All, SingleProduct, filter, giverating }