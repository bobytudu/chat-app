import { useMediaQuery, useTheme } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import get from "lodash/get";
import * as React from "react";
import { Controller } from "react-hook-form";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { Control } from "react-hook-form";

export interface AutoCompletePropsTypes {
  options: { label: string; value: string }[];
  label: string;
  loading?: boolean;
  sx?: SxProps;
  control: Control<any>;
  name: string;
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  optionLabel?: string;
  renderOption?: any;
  fullWidth?: boolean;
}

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };
  return <div style={inlineStyle}>{dataSet}</div>;
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = [];
  (children as React.ReactChild[]).forEach(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  );

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: React.ReactChild) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: any) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

function CustomAutoComplete(props: AutoCompletePropsTypes) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { value, onChange } }) => (
        <Box sx={{ minWidth: 250, ...props.sx }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 0.6, fontSize: 14, fontWeight: 600 }}
          >
            {props.label}
          </Typography>
          <Autocomplete
            disablePortal
            id="custom-autocomplete"
            value={value}
            renderOption={props.renderOption}
            multiple={get(props, "multiple", false)}
            disableCloseOnSelect={get(props, "disableCloseOnSelect", false)}
            onChange={(event: any, newValue: string[] | null) =>
              onChange(newValue)
            }
            fullWidth={props.fullWidth}
            options={props.options}
            loading={props.loading}
            ListboxComponent={ListboxComponent}
            renderTags={(value) => {
              if (Array.isArray(value)) return `${value.length} items selected`;
              return null;
            }}
            sx={{
              minWidth: get(props, "sx.minWidth", "200px"),
              mb: 3,
              ...props.sx,
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      )}
    />
  );
}

export default CustomAutoComplete;
