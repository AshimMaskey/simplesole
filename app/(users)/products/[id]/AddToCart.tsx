"use client";
import { ProductModal } from "@/components/shop/product-modal";
import { Product } from "@/types/product";
import React, { useState } from "react";

interface AddToCartProps {
  product: Product;
}

const AddToCart = ({ product }: AddToCartProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-black cursor-pointer flex-1 text-white px-6 py-3 rounded-lg hover:opacity-80 transition"
      >
        Add to Cart
      </button>
      <ProductModal
        product={product}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default AddToCart;
