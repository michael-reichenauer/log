import React from 'react'
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from "@material-ui/core/TableCell";
import { InfiniteLoader, AutoSizer, Column, Table } from 'react-virtualized';


const styles = (theme) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    tableCell: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
    },
    noClick: {
        cursor: 'initial',
    },
});

class MuiVirtualizedTable extends React.PureComponent {
    static defaultProps = {
        headerHeight: 20,
        rowHeight: 20,
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ cellData, columnIndex }) => {
        const { columns, classes, rowHeight, onRowClick } = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                style={{ height: rowHeight }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {cellData}
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes } = this.props;

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight }}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                <span>{label}</span>
            </TableCell>
        );
    };

    render() {
        const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
        const { rowCount, isRowLoaded, loadMoreRows, minimumBatchSize, threshold, isAutoScroll, onScroll, refreshId } = this.props

        if (refreshId !== this.refreshId && this.tableRef) {
            console.log('Refresh requested #########################')
            this.refreshId = refreshId
            setTimeout(this.tableRef.forceUpdateGrid, 0);
        }

        return (
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={rowCount}
                minimumBatchSize={minimumBatchSize}
                threshold={threshold}
            >
                {({ onRowsRendered, registerChild }) => (
                    <AutoSizer>
                        {({ height, width }) => (
                            <Table
                                ref={ref => {
                                    this.tableRef = ref
                                    registerChild(ref)

                                }}
                                onRowsRendered={onRowsRendered}
                                width={width}
                                height={height}
                                rowHeight={rowHeight}
                                gridStyle={{
                                    direction: 'inherit',
                                }}
                                headerHeight={headerHeight}
                                className={classes.table}
                                {...tableProps}
                                rowClassName={this.getRowClassName}
                                scrollToIndex={isAutoScroll ? Number.MAX_SAFE_INTEGER : -1}
                                onScroll={onScroll}
                            >
                                {columns.map(({ dataKey, ...other }, index) => {
                                    return (
                                        <Column
                                            key={dataKey}
                                            headerRenderer={(headerProps) =>
                                                this.headerRenderer({
                                                    ...headerProps,
                                                    columnIndex: index,
                                                })
                                            }
                                            className={classes.flexContainer}
                                            cellRenderer={this.cellRenderer}
                                            dataKey={dataKey}
                                            {...other}
                                        />
                                    );
                                })}
                            </Table>
                        )}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        );
    }
}



export const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
