describe('sorting the list of users', function() {
    it('sorts in descending order by default', function() {
        var users = ['jack', 'igor', 'jeff'];
        var sorted = sortUsers(users);
        expect(sorted).toEqual(['jeff', 'jack', 'igor']);
    });
});
