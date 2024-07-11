import React from 'react';
import styles from './EventSkeleton.module.scss';

const EventSkeleton = ({ count }) => {
    // count 값이 유효한지 확인, 음수이거나 유효하지 않으면 0으로 설정
    const validCount = Number.isInteger(count) && count > 0 ? count : 0;

    return (
        <div className={styles.events}>
            <div className={styles.list}>
                {
                    Array.from(new Array(validCount)).map(
                        (_, index) => (
                            <div
                                className={styles.skeleton}
                                key={index}
                            >
                                <div className={styles.imageSkeleton} />
                                <div className={styles.contentSkeleton}>
                                    <div className={styles.titleSkeleton} />
                                    <div className={styles.dateSkeleton} />
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
};

EventSkeleton.displayName = 'EventSkeleton';

export default EventSkeleton;