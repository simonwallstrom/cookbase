# Todo list

- [x] Home – Add onboarding based on URL query string `?welcome`
- [x] Home – Pull data from database for top meal types and cuisines
- [x] Home – Add empty states
- [x] Settings – Edit account name
- [x] Improve start page design
- [x] Auth – Signup with invitation link
- [x] Settings – Enable/Disable invite link
- [x] Settings – Regenerate invite link
- [x] Remove user roles
- [x] Settings – Edit profile first- and last name
- [x] Notes – Create and delete
- [x] Notes – Resolve notes
- [x] Notes – Pending UI and clear inputs on submission
- [x] Add toast notification(Sonner) for note actions
- [x] Move recipe notes into a separate component
- [x] Pending UI
- [x] Recent activity
- [ ] Delete recipe
- [ ] Settings – Delete user
- [ ] Settings – Delete org
- [ ] Implement Request access-form
- [ ] Add changelog
- [ ] Add error boundary components
- [ ] Add redirectTo on login
- [ ] Destructure all data from loaderData, this way we know explicitly which data is used


## Feature ideas

### Recipe notes

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