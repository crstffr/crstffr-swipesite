<?php

use ChromePhp as console;

class Genre {

    public static $useCache = true;
    public static $cacheKey = "genres";
    public static $cacheTtl = 7; // days for cache to live

    public static function getAll() {

        $genres = Cache::get(self::$cacheKey);

        if (empty($genres)) {

            $genres = array();

            $lookup = Beatport::genres();
            $lookup->subgenres = true;

            $response = $lookup->fetch();
            $results = $response->results;

            foreach($results as $genre) {

                $genres[$genre->id] = $genre->name;
                foreach($genre->subgenres as $subgenre) {
                    $genres['sub:'.$subgenre->id] = $genre->name . " - " . $subgenre->name;
                }

            }

            asort($genres);

            Cache::put(self::$cacheKey, $genres, self::$cacheTtl*60*24);

        }

        return $genres;

    }

}