export type Album = {
  url: string;
  cd_title: string;
  series: string;
  full_title: string;
  origin_url: string;
  artist:Artist;
};

export type Artist = {
  character: string[];
  voice: string[];
};