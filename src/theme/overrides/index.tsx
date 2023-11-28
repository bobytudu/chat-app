//
import Card from './Card'
import Paper from './Paper'
import Input from './Input'
import Table from './Table'
import Tab from './Tab'
import Button from './Button'
import Tooltip from './Tooltip'
import Backdrop from "./Backdrop";
import Autocomplete from "./Autocomplete";
import { Theme } from "@mui/material";
import { Shadows } from "theme/customShadows";
import { PaletteType } from "theme/palette";
import InputLabel from "./InputLabel";
import Dialog from "./Dialog";

// ----------------------------------------------------------------------

export type ComponentsOverridesProps = Theme & {
  customShadows: Shadows;
  palette: PaletteType;
};

export default function ComponentsOverrides(theme: ComponentsOverridesProps) {
  return Object.assign(
    Card(theme),
    Table(theme),
    Input(theme),
    Paper(),
    Button(theme),
    Tooltip(theme),
    Backdrop(theme),
    Autocomplete(theme),
    Tab(),
    InputLabel(theme),
    Dialog(theme)
  );
}
