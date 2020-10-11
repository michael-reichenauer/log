import React from 'react';
import { useGlobal, useCallback } from 'reactn'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { useLocalStorage } from '../utils/useLocalStorage';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


const isIos = () => {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

const isInStandaloneMode = () =>
    (window.matchMedia('(display-mode: standalone)').matches)
    || (window.navigator.standalone)
    || document.referrer.includes('android-app://');

const isPwa = () => {
    return ["fullscreen", "standalone", "minimal-ui"].some(
        (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
    );
}

const defaultIsPrompt = (!isInStandaloneMode() && !isPwa())

export const usePwaPrompt = () => {
    const [showPwaPrompt, setShowPwaPrompt] = useLocalStorage('promptPwa', defaultIsPrompt)
    const [show, setShow] = useGlobal('promptPwa')
    if (show === undefined) {
        setShow(showPwaPrompt)
    }
    const set = useCallback(v => {
        setShow(v)
        setShowPwaPrompt(v)
    }, [setShow, setShowPwaPrompt])
    return [show, set]
}

export const PwaPrompt = () => {
    const [showPwaPrompt, setShowPwaPrompt] = usePwaPrompt()

    const handleClose = () => {
        setShowPwaPrompt(false);
    };

    return (
        <>
            { showPwaPrompt &&
                <Dialog
                    open={showPwaPrompt}
                    TransitionComponent={Transition}
                    keepMounted
                    PaperProps={{
                        style: {
                            backgroundColor: "#333333"
                        },
                    }}
                >
                    <DialogTitle>{"Hint: Install Log"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Install this Log app on your home screen for quick and easy access.
                   </DialogContentText>
                        <DialogContentText>
                            Just tap the share button and then 'Add to Home Screen'.
                   </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleClose} >Close</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}






