import { useEffect, useRef, useState } from "react"

const useButtonLoader = (defaultText = "Load", loadingText = "Loading....") => {
    const [isLoading, setLoading] = useState(false);
    // const element = useRef(null);

    // useEffect(() => {
    //     if(isLoading){
    //         element.current.disabled = true;
    //         element.current.innerHTML = '<i className="fa-solid fa-circle-notch fa-spin"></i>' + loadingText;
    //     }else {
    //         element.current.disabled = false;
    //         element.current.innerHTML = defaultText;
    //     }
    // }, [isLoading]);


    // Don't need ref to change text, we'll control it with state
    const buttonText = isLoading ? (
        <>
            <i className="fa-solid fa-circle-notch fa-spin"></i> {loadingText}
        </>
    ) : (
        defaultText
    );

    useEffect(() => {
        // Automatically manage the button's disabled state
        const buttonElement = document.querySelector(".submit");
        if (buttonElement) {
            buttonElement.disabled = isLoading;
        }
    }, [isLoading]);

    return [buttonText, setLoading];
};

export default useButtonLoader;