import { Pressable, PressableProps, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from "react";
import { tUserPath } from './trackUser/whitelist';
import { updateUserPath } from './trackUser/storeUserPath';
import { saveOrUpdateRecordItem } from './appStructure/recordStore';

type XYPressableProps = PressableProps & { currentState: any };

export const AIPressable = ({ onPress, accessibilityLabel, currentState, ...props }: XYPressableProps) => {
    const myRef = useRef<View>(null);
    // State to hold the previous value
    const [previousValue, setPreviousValue] = useState<any>(currentState);
    // State to determine if the button has been pressed
    const [isPressed, setIsPressed] = useState<boolean>(false);

    // Effect to update the previous value when `value` changes
    useEffect(() => {
        if (isPressed) {
            setPreviousValue(currentState);
            setIsPressed(false);

            if (accessibilityLabel) {
                console.log('CURRENT:', currentState);
                console.log('PREV:', previousValue);
                const myPath: tUserPath = {
                    actionName: accessibilityLabel,
                    newState: currentState,
                    oldState: previousValue,
                }
                updateUserPath(myPath);
            }
        }
    }, [accessibilityLabel, currentState, isPressed, previousValue]);

    const myOnPress = useCallback(() => {
        if (onPress) {
            setIsPressed(true);
            onPress();
        }
    }, [accessibilityLabel, currentState, onPress, previousValue]);

    const myOnLayout = useCallback(() => {
        if (myRef && myRef.current && accessibilityLabel) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            myRef.current.measure((_x: any, _y: any, _width: any, _height: any, pageX: any, pageY: any) => {
                console.log('tx:', pageX, 'ty:', pageY);
                saveOrUpdateRecordItem({ action: accessibilityLabel, x: pageX, y: pageY });
                // pageX and pageY give the position of the element relative to the whole screen
            });
        }
    }, [accessibilityLabel]);

    return <Pressable onLayout={myOnLayout} onPress={myOnPress} accessibilityLabel={accessibilityLabel} ref={myRef} {...props} />;
};
