import * as React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDuration } from '../common/video';

const useStyles = makeStyles({
	root: {
		position: 'relative',
		width: '100%',
		height: '100%',
	},
	scrollContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		overflowX: 'scroll',
	},
	content: {
		height: '100%',
	},
});

const ZoomContext = React.createContext({ zoomContainerRect: {} });

ZoomContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default function ZoomContainer({ children }) {
	// in pixels per second
	const [zoom] = React.useState(200);
	const { duration } = useDuration();
	const classes = useStyles();
	const width = Number.isFinite(duration) ? Math.round(zoom * duration) : '100%';

	const [zoomContainerRef, setZoomContainerRef] = React.useState();
	const [zoomContainerRect, setZoomContainerRect] = React.useState({});

	React.useLayoutEffect(() => {
		if (zoomContainerRef) {
			setZoomContainerRect(zoomContainerRef.getBoundingClientRect());
		}
	}, [zoomContainerRef, width]);

	// make sure we recalculate the rect after scrolling
	const onMouseUp = () => {
		setZoomContainerRect(zoomContainerRef.getBoundingClientRect());
	};

	// beware of adding renders that don't have to do with the recalculation of zoom or zoomContainerRect.
	return (
		<div className={classes.root}>
			<div className={classes.scrollContainer} onMouseUp={onMouseUp}>
				<div ref={setZoomContainerRef} className={classes.content} style={{ width }}>
					<ZoomContext.Provider value={{ zoom, zoomContainerRect }}>{children}</ZoomContext.Provider>
				</div>
			</div>
		</div>
	);
}

export function useZoom() {
	return React.useContext(ZoomContext);
}