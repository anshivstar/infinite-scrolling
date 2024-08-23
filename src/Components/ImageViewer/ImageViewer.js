import React, { useEffect, useRef, useState } from "react";
import styles from "./ImageViewer.module.css";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";

const ImageViewer = () => {
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const fetchImages = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_UNSPLASH_URL}/random?client_id=${
          process.env.REACT_APP_ACCESS_KEY
        }&count=${10}`
      )
      .then((res) => setImages((prev) => [...prev, ...res.data]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      {images.map((imgs, i) => (
        <div className={styles.box} data-testid={`item-${i + 1}`}>
          <img height={220} src={imgs?.urls?.regular} alt="img" />
          <div>{imgs?.slug}</div>
        </div>
      ))}
      {!loading ? (
        <div className={styles.loader}>
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : null}
      <div ref={loader} />
    </div>
  );
};

export default ImageViewer;
