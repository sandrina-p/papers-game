import { StyleSheet } from 'react-native';
import * as Theme from '@theme';

export default StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 8,
    // ${Theme.bp.xs} {
    //   margin-bottom: 2rem;
    // }
  },
  header_title: {},
  headerImg: {
    marginTop: 8,
    width: 140,
    height: 140,
  },
  cap: {
    paddingBottom: 8,
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  list: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  // same as TeamsStyles
  headerTeam: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  // same as TeamsStyles
  team: {
    marginTop: 8,
    marginBottom: 40,
  },
  status: {
    paddingTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});