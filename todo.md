# Todo list

- [ ] Home – Add onboarding based on URL query string `?welcome`
- [ ] Home – Pull data from database for top meal types and cuisines
- [ ] Home – Add empty states


## Feature ideas

### Comments

Add comments to each recipe. Should it be possible to "resolve" comments like in Google Docs?


### Activity

Log the following actions in a table called `Activity`:

* When a user creates a recipe
* When a user comments on a recipe
* When a user updates a recipe
* When a user was added
* When a user was removed

Database columns:

* user_id
* recipe_id
* comment_id

Database design inspiration:

```
id | user_id | org_id | created_at | action | trackable_id | trackable_type
1  |       1 |      5 |   datetime | Action |            3 |         Type

enum Action {
  CREATE
  UPDATE
  DELETE
}

enum Type {
  RECIPE
  COMMENT
}
```


### Meal planner

Plan meals for the coming week, pull in recipes and put them in a calendar view


### Groceries

Copy selected ingredients to the clipboard and paste into Apple reminders