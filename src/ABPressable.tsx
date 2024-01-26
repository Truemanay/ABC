import { Pressable, PressableProps, View } from 'react-native';
import React, { FC, forwardRef, useCallback, useEffect, useRef, useState } from "react";
// import { tUserPath } from './trackUser/whitelist';
import { updateUserPath } from './trackUser/storeUserPath';
import { saveOrUpdateRecordItem } from './appStructure/recordStore';
import { interactableLinks } from './ABContext';

export type ABPressable = {
    press: () => void;
};

export type ABPressableProps = Omit<PressableProps, "onPress"> & { currentState: any; actionDescription: string; onPress: () => void; };


export const ABPressable: React.FC<ABPressableProps> = ({ onPress, actionDescription, accessibilityLabel, currentState, ...props }) => {
    const pressableRef = useRef<View>(null);
    // State to hold the previous value
    const [previousValue, setPreviousValue] = useState<any>(currentState);
    // State to determine if the button has been pressed
    const [isPressed, setIsPressed] = useState<boolean>(false);

    console.log("ABPressable");

    // Effect to update the previous value when `value` changes
    useEffect(() => {
        if (isPressed) {
            setPreviousValue(currentState);
            setIsPressed(false);

            if (actionDescription) {
                console.log('CURRENT:', currentState);
                console.log('PREV:', previousValue);
                const myPath: any = {
                    actionName: actionDescription,
                    newState: currentState,
                    oldState: previousValue,
                }
                updateUserPath(myPath);
            }
        }
    }, [actionDescription, currentState, isPressed, previousValue]);

    const myOnPress = useCallback(() => {
        // setIsPressed(true);
        onPress();
    }, [onPress]);

    const myOnLayout = useCallback(() => {
        // if (myRef && myRef.current && actionDescription) {
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // myRef.current.measure((_x: any, _y: any, _width: any, _height: any, pageX: any, pageY: any) => {
        //         console.log('tx:', pageX, 'ty:', pageY);
        //         saveOrUpdateRecordItem({ action: actionDescription, x: pageX, y: pageY });
        //         // pageX and pageY give the position of the element relative to the whole screen
        //     });
        // }

        console.log("onLayout");
        pressableRef.current?.measure((_x: any, _y: any, _width: any, _height: any, pageX: any, pageY: any) => {
            console.log("measure, ", pageX, pageY);
            interactableLinks[actionDescription] = {
                pageX,
                pageY,
                press: myOnPress,
            }
            console.log("interacatbles: ", interactableLinks);
        })
    }, [actionDescription]);

    return <Pressable onPress={myOnPress} accessibilityLabel={accessibilityLabel ?? actionDescription} onLayout={myOnLayout} ref={pressableRef} {...props} />;
};
