"""Maps nfl_data_py weekly data columns to our stat_category names."""

# (nfl_data_py column name, our stat_category name, display_name, category_group)
WEEKLY_STAT_COLUMNS = [
    # Passing
    ("completions", "completions", "Completions", "passing"),
    ("attempts", "pass_attempts", "Pass Attempts", "passing"),
    ("passing_yards", "passing_yards", "Passing Yards", "passing"),
    ("passing_tds", "passing_tds", "Passing TDs", "passing"),
    ("interceptions", "interceptions", "Interceptions", "passing"),
    ("passing_2pt_conversions", "passing_2pt", "Passing 2PT", "passing"),

    # Rushing
    ("carries", "carries", "Carries", "rushing"),
    ("rushing_yards", "rushing_yards", "Rushing Yards", "rushing"),
    ("rushing_tds", "rushing_tds", "Rushing TDs", "rushing"),
    ("rushing_fumbles", "rushing_fumbles", "Rushing Fumbles", "rushing"),
    ("rushing_2pt_conversions", "rushing_2pt", "Rushing 2PT", "rushing"),

    # Receiving
    ("receptions", "receptions", "Receptions", "receiving"),
    ("targets", "targets", "Targets", "receiving"),
    ("receiving_yards", "receiving_yards", "Receiving Yards", "receiving"),
    ("receiving_tds", "receiving_tds", "Receiving TDs", "receiving"),
    ("receiving_fumbles", "receiving_fumbles", "Receiving Fumbles", "receiving"),
    ("receiving_2pt_conversions", "receiving_2pt", "Receiving 2PT", "receiving"),

    # General
    ("fantasy_points", "fantasy_points", "Fantasy Points", "general"),
    ("fantasy_points_ppr", "fantasy_points_ppr", "Fantasy Points PPR", "general"),
    ("sack_yards", "sack_yards", "Sack Yards", "passing"),
    ("sack_fumbles", "sack_fumbles", "Sack Fumbles", "passing"),
    ("special_teams_tds", "special_teams_tds", "Special Teams TDs", "general"),
]

# Team-level stats derived from schedules
TEAM_STAT_CATEGORIES = [
    ("points_scored", "Points Scored", "team"),
    ("points_allowed", "Points Allowed", "team"),
    ("wins", "Wins", "team"),
    ("losses", "Losses", "team"),
    ("ties", "Ties", "team"),
]
